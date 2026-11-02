// End-to-end API tests against a real MySQL (CI starts one; locally: docker compose up -d db).
// Requires the schema from db/schema.sql to be loaded.
const request = require('supertest');
const app = require('../app');
const db = require('../db');

const run = Date.now().toString(36);
const names = { teacher: `teacher_${run}`, student: `student_${run}`, other: `other_${run}` };
const password = 'correct horse battery';

const q = (sql, p = []) => new Promise((res, rej) => db.query(sql, p, (e, r) => (e ? rej(e) : res(r))));
const register = (agent, name, role) =>
  agent.post('/auth/register').send({ username: name, password, email: `${name}@test.dev`, role, bio: '' });

const teacher = request.agent(app);
const student = request.agent(app);
const outsider = request.agent(app);
let courseId, contentId;

afterAll(async () => {
  await q('DELETE FROM users WHERE username IN (?)', [Object.values(names)]);
  db.end();
});

test('registering creates a session and the right profile row', async () => {
  expect((await register(teacher, names.teacher, 'instructor')).status).toBe(200);
  expect((await register(student, names.student, 'student')).status).toBe(200);
  expect((await register(outsider, names.other, 'student')).status).toBe(200);
  const me = await teacher.get('/auth/check');
  expect(me.body).toMatchObject({ authenticated: true, role: 'instructor' });
});

test('duplicate usernames are rejected and bad passwords cannot log in', async () => {
  expect((await register(request.agent(app), names.student, 'student')).status).toBe(400);
  const bad = await request(app).post('/auth/login').send({ username: names.student, password: 'wrong' });
  expect(bad.status).toBe(401);
  const good = await request(app).post('/auth/login').send({ username: names.student, password });
  expect(good.status).toBe(200);
});

test('only instructors can create courses; instructors can upload content', async () => {
  const body = { title: 'Test course', description: 'About testing', price: 10, duration_weeks: 2, status: 'published' };
  expect((await student.post('/courses/createcourse').send(body)).status).toBe(403);
  const created = await teacher.post('/courses/createcourse').send(body);
  expect(created.status).toBe(201);
  courseId = created.body.courseId;

  const up = await teacher.post(`/content/upload/${courseId}`).attach('file', Buffer.from('hello course'), 'notes.txt');
  expect(up.status).toBe(200);
  const list = await teacher.get(`/content/${courseId}`);
  expect(list.body).toHaveLength(1);
  contentId = list.body[0].content_id;
});

test('content is only readable by the instructor and enrolled students', async () => {
  expect((await request(app).get(`/content/view/${contentId}`)).status).toBe(401);   // not logged in
  expect((await outsider.get(`/content/view/${contentId}`)).status).toBe(404);       // logged in, not enrolled
  expect((await student.post('/courses/enroll').send({ course_id: courseId })).status).toBe(201);
  const ok = await student.get(`/content/view/${contentId}`);
  expect(ok.status).toBe(200);
  expect(Buffer.from(ok.body.file_data, 'base64').toString()).toBe('hello course');
  expect((await teacher.get(`/content/view/${contentId}`)).status).toBe(200);
});

test('enrolling twice fails; rating and feedback are validated and stored', async () => {
  expect((await student.post('/courses/enroll').send({ course_id: courseId })).status).toBe(400);
  expect((await student.put(`/courses/${courseId}/rate`).send({ rating: 9 })).status).toBe(400);
  expect((await student.put(`/courses/${courseId}/rate`).send({ rating: 4 })).status).toBe(200);
  expect((await student.put(`/courses/${courseId}/feedback`).send({ feedback: 'Great' })).status).toBe(200);
  expect((await outsider.put(`/courses/${courseId}/rate`).send({ rating: 5 })).status).toBe(403);
  const fb = await teacher.get('/courses/instructor/feedback');
  expect(fb.body.feedback[0]).toMatchObject({ feedback: 'Great', rating: 4, student_name: names.student });
});

test('the enrolled-courses list carries the instructor name', async () => {
  const mine = await student.get('/courses/enrolledCourses');
  expect(mine.body[0]).toMatchObject({ id: courseId, instructor_name: names.teacher });
});

test('available courses list includes description and instructor', async () => {
  const free = await outsider.get('/courses/unenrolledCourses');
  const mine = free.body.find(c => c.id === courseId);
  expect(mine).toMatchObject({ title: 'Test course', description: 'About testing', instructor_name: names.teacher });
});

test('instructor analytics summarise enrolments, rating and revenue', async () => {
  const a = await teacher.get('/analytics/instructor');
  expect(a.status).toBe(200);
  expect(a.body.stats).toMatchObject({ courseCount: 1, totalStudents: 1, averageRating: 4, totalRevenue: 10 });
  expect(a.body.charts.topCourses[0]).toMatchObject({ title: 'Test course', enrollments: 1 });
  expect((await student.get('/analytics/instructor')).status).toBe(403);
});

test('a course with active students cannot be deleted; progress can be updated', async () => {
  expect((await student.put(`/data/course/${courseId}/progress`).send({ progress: 50 })).status).toBe(200);
  expect((await teacher.post('/courses/delete').send({ courseId })).status).toBe(400);
});
