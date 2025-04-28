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
    db.query(`select c.course_id as id ,  c.title from courses c where c.course_id not in (select f.course_id from enrolledCourses f where f.student_id = (select s.student_id from students s where s.user_id = ?) )`,[id] , (err , result)=>{

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
  
  router.post('/createcourse', ensureAuthenticated , ensureInstructor,  (req, res) => {
    const { instructorId, title, description, status } = req.body;
  
    if (!instructorId || !title || !description || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.query(`INSERT INTO Courses (instructor_id, title, description, status)
         VALUES (?, ?, ?, ?)` , [instructorId, title, description, status] , (err , result)=>{
            if (err){ res.status(500).message(`error`)}
            res.status(201).json({ message: 'Course created', courseId: result.insertId });
         } )});
  
        


           
router.post('/enroll', ensureAuthenticated, ensureStudent, (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;
    console.log(userId)
    
    // Get the student_id
    db.query(
      'SELECT student_id FROM students WHERE user_id = ?',
      [userId],
      (err, result) => {
        if (err || result.length === 0) {
          console.error('Error finding student:', err);
          return res.status(400).json({ error: 'Invalid student account' });
        }
        
        const studentId = result[0].student_id;
        
        // Check if already enrolled
        db.query(
          'SELECT enrollment_id FROM enrolledcourses WHERE student_id = ? AND course_id = ?',
          [studentId, course_id],
          (err, result) => {
            if (err) {
              console.error('Error checking enrollment:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.length > 0) {
              return res.status(400).json({ error: 'Already enrolled in this course' });
            }
            
            // Create the enrollment
            db.query(
              'INSERT INTO enrolledcourses (student_id, course_id) VALUES (?, ?)',
              [studentId, course_id],
              (err, result) => {
                if (err) {
                  console.error('Error enrolling in course:', err);
                  return res.status(500).json({ error: 'Database error' });
                }
                
                res.status(201).json({ 
                  id: result.insertId,
                  message: 'Successfully enrolled in course' 
                });
              }
            );
          }
        );
      }
    );
  });
  
module.exports = router;