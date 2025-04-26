var express =require(`express`);
var router = express.Router();
var db = require(`../db`);

const {ensureAuthenticated , ensureInstructor , ensureStudent } = require(`../middleware/authMiddleware`);

router.get(`/enrolledCourses` , ensureAuthenticated , ensureStudent , (req , res)=>{
    var id = req.user.id;
    console.log(id);
    db.query(`select c.course_id as id , c.title as title from courses c where c.course_id in (select e.course_id from enrolledcourses e where e.student_id = (select s.student_id from students s where s.user_id = ?))` , [id] , (err,result)=>{
        console.log(result);
        
        res.json(result);
    })
})


router.get('/unenrolledCourses' ,ensureAuthenticated , ensureStudent , (req,res)=>{
    var id = req.user.id;
    console.log(id);
    db.query(`select c.title from courses c where c.course_id not in (select f.course_id from enrolledCourses f where f.student_id = (select s.student_id from students s where s.user_id = ?) )`,[id] , (err , result)=>{

        res.json(result);
    })
})

router.get(`/courses` , ensureAuthenticated , ensureInstructor ,  (req , res) =>{
    var user = req.user;
    console.log(user);
    var id = user.id;
    console.log(id);
    db.query(`select c.course_id as id, c.title as title from courses c , instructors i where i.instructor_id = c.instructor_id and i.instructor_id = (select instructor_id from instructors j  where j.user_id = ? ) `, [id] , (err,result)=>{
        console.log(result);
        res.json(result);
    })
 
})

router.get('/course/:id', ensureAuthenticated, (req, res) => {
    const courseId = req.params.id;
    
    db.query(
      `SELECT c.course_id as id, c.title, c.description, c.price, c.duration_weeks, 
      c.status, c.created_at, i.instructor_id, u.username as instructor_name, 
      i.bio as instructor_bio, i.expertise
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.instructor_id
      JOIN users u ON i.user_id = u.user_id
      WHERE c.course_id = ?`,
      [courseId],
      (err, result) => {
        if (err) {
          console.error('Error fetching course details:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json(result[0]);
      }
    );
  });

router.get('/allCourses', ensureAuthenticated, (req, res) => {
    db.query(
      `SELECT c.course_id as id, c.title, c.description, c.price, c.status, 
      i.instructor_id, u.username as instructor_name 
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.instructor_id
      JOIN users u ON i.user_id = u.user_id
      WHERE c.status = 'published'`,
      (err, result) => {
        if (err) {
          console.error('Error fetching courses:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(result);
      }
    );
  });
  
  router.post('/createcourse', async (req, res) => {
    const { instructorId, title, description, status } = req.body;
  
    if (!instructorId || !title || !description || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(`INSERT INTO Courses (instructor_id, title, description, status)
         VALUES (?, ?, ?, ?)` , [instructorId, title, description, status] , (err , result)=>{
            if (err){ res.status(500).message(`error`)}
            res.status(201).json({ message: 'Course created', courseId: result.insertId });
         } )});
  
        

         router.get('/course/:id/content', ensureAuthenticated, (req, res) => {
             const courseId = req.params.id;
             
             // First verify the user has access to this course
             const userId = req.user.id;
             const userType = req.user.user_type;
             
             let accessCheckQuery;
             let accessCheckParams;
             
             if (userType === 'instructor') {
               accessCheckQuery = `
                 SELECT 1 FROM courses c
                 JOIN instructors i ON c.instructor_id = i.instructor_id
                 WHERE c.course_id = ? AND i.user_id = ?
               `;
               accessCheckParams = [courseId, userId];
             } else if (userType === 'student') {
               accessCheckQuery = `
                 SELECT 1 FROM enrolledcourses e
                 JOIN students s ON e.student_id = s.student_id
                 WHERE e.course_id = ? AND s.user_id = ?
               `;
               accessCheckParams = [courseId, userId];
             } else {
               // Staff can access all courses
               accessCheckQuery = 'SELECT 1';
               accessCheckParams = [];
             }
             
             db.query(accessCheckQuery, accessCheckParams, (err, result) => {
               if (err) {
                 console.error('Error checking course access:', err);
                 return res.status(500).json({ error: 'Database error' });
               }
               
               if (userType !== 'staff' && result.length === 0) {
                 return res.status(403).json({ error: 'Not authorized to access this course' });
               }
               
               // Get all course content
               db.query(
                 `SELECT p.post_id, p.timeOfPost, p.postcol, 
                   CASE 
                     WHEN a.post_post_id IS NOT NULL THEN 'announcement'
                     WHEN q.post_post_id IS NOT NULL THEN 'quiz' 
                     WHEN ass.post_post_id IS NOT NULL THEN 'assignment'
                     WHEN l.post_post_id IS NOT NULL THEN 'lecture'
                     WHEN s.post_post_id IS NOT NULL THEN 'slide'
                     ELSE 'post'
                   END as content_type,
                   COALESCE(q.quiz_id, ass.assignment_id, NULL) as content_id
                 FROM post p
                 LEFT JOIN announcements a ON p.post_id = a.post_post_id
                 LEFT JOIN quizes q ON p.post_id = q.post_post_id
                 LEFT JOIN assignments ass ON p.post_id = ass.post_post_id
                 LEFT JOIN lectures l ON p.post_id = l.post_post_id
                 LEFT JOIN slides s ON p.post_id = s.post_post_id
                 WHERE p.courses_course_id = ?
                 ORDER BY p.timeOfPost DESC`,
                 [courseId],
                 (err, result) => {
                   if (err) {
                     console.error('Error fetching course content:', err);
                     return res.status(500).json({ error: 'Database error' });
                   }
                   
                   res.json(result);
                 }
               );
             });
           });
           

module.exports = router;