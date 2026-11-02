// Demo data: one instructor, two students, three published courses with enrolments, ratings and a file.
// Idempotent: does nothing if the demo instructor already exists.  Run with:  npm run seed
const crypto = require('crypto');
const db = require('../db');

const q = (sql, params = []) =>
  new Promise((resolve, reject) => db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));

const hash = (password) => {
  const salt = crypto.randomBytes(16);
  return { salt, hash: crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256') };
};

async function addUser(username, password, type, bio) {
  const { salt, hash: h } = hash(password);
  const r = await q(
    'INSERT INTO users (username, password, salt, email, user_type, display_name, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [username, h, salt, `${username}@edutrack.demo`, type, username, bio]);
  const table = type === 'student' ? 'students' : 'instructors';
  const row = await q(`INSERT INTO ${table} (user_id, full_name) VALUES (?, ?)`, [r.insertId, username]);
  return row.insertId;
}

async function seed() {
  if ((await q("SELECT 1 FROM users WHERE username = 'demo_instructor'")).length) {
    console.log('Seed skipped: demo data already present');
    return;
  }
  const instructor = await addUser('demo_instructor', 'demo1234', 'instructor', 'Teaches web development and data science.');
  const ana = await addUser('demo_student', 'demo1234', 'student', 'Learning to build for the web.');
  const bilal = await addUser('bilal', 'demo1234', 'student', 'Interested in data.');

  const course = async (title, description, price, weeks, category, image) =>
    (await q('INSERT INTO courses (instructor_id, title, description, price, duration_weeks, status, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [instructor, title, description, price, weeks, 'published', category, image])).insertId;
  const web = await course('Modern Web Development', 'HTML, CSS and JavaScript from the ground up, then React and a Node API.', 49.0, 8, 'Programming', '/courses/web.svg');
  const sql = await course('SQL for Analysts', 'Query, join and aggregate real datasets with MySQL.', 29.0, 4, 'Data', '/courses/sql.svg');
  const ml = await course('Machine Learning Foundations', 'Regression, classification and model evaluation with scikit-learn.', 79.0, 10, 'Data', '/courses/ml.svg');

  const enrol = (student, c, status, progress, rating, feedback, daysAgo) =>
    q('INSERT INTO enrolledcourses (student_id, course_id, status, progress, rating, feedback, enrolled_at) VALUES (?, ?, ?, ?, ?, ?, NOW() - INTERVAL ? DAY)',
      [student, c, status, progress, rating, feedback, daysAgo]);
  await enrol(ana, web, 'in_progress', 60, 5, 'Clear and practical, the React section was great.', 70);
  await enrol(ana, sql, 'completed', 100, 4, 'Good pace. More exercises would help.', 45);
  await enrol(bilal, web, 'in_progress', 25, null, null, 20);
  await enrol(bilal, ml, 'in_progress', 10, null, null, 5);

  await q('INSERT INTO content (course_id, file_name, content_type, file_data) VALUES (?, ?, ?, ?)',
    [web, 'welcome.txt', 'text/plain', Buffer.from('Welcome to Modern Web Development! Start with module 1.')]);
  console.log('Seeded demo data. Log in as demo_instructor / demo_student (password demo1234).');
}

seed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
