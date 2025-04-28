var express = require(`express`);
var router = express.Router();
var multer = require(`multer`);
var db = require(`../db`);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var { ensureAuthenticated , ensureInstructor , ensureOwnership} = require(`../middleware/authMiddleware`);

router.post('/upload/:id', ensureAuthenticated, ensureInstructor, upload.single('file'), (req, res) => {
    const courseId = req.params.id;
    const file = req.file;
    const fileName = req.body.file_name || file.originalname;
    const contentType = req.body.content_type || file.mimetype;
  
    console.log('Course ID:', courseId);
    console.log('File uploaded:', file);
    console.log('File name:', fileName);
    console.log('Content type:', contentType);
    console.log('Instructor ID from session:', req.user.id);
  
    var instructorId;
  
    // Check if the instructor owns the course
    db.query('SELECT instructor_id FROM instructors WHERE user_id = ?', [req.user.id], (err, result) => {
      if (err) {
        console.error('Error fetching instructor ID:', err);
        return res.status(500).send('Internal server error.');
      }
  
      instructorId = result[0].instructor_id;
  
      if (!file) {
        console.log('No file uploaded.');
        return res.status(400).send('No file uploaded.');
      }
  
      // Check if the instructor is the owner of the course
      const query = 'SELECT instructor_id FROM courses WHERE course_id = ?';
      db.query(query, [courseId], (err, results) => {
        if (err) {
          console.error('Error querying course data:', err);
          return res.status(500).send('Error verifying course ownership.');
        }
  
        if (results.length === 0) {
          console.log('Course not found.');
          return res.status(404).send('Course not found.');
        }
  
        const courseInstructorId = results[0].instructor_id;
  
        if (courseInstructorId !== instructorId) {
          console.log('Instructor does not own this course.');
          return res.status(403).send('Forbidden: You are not the owner of this course.');
        }
  
        // Insert the file into the database
        const insertQuery = 'INSERT INTO content (course_id, file_name, content_type, file_data) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [courseId, fileName, contentType, file.buffer], (err, result) => {
          if (err) {
            console.error('Error inserting file into database:', err);
            return res.status(500).send('Error uploading file.');
          }
  
          console.log('File uploaded and inserted into the database successfully!');
          res.status(200).send('File uploaded successfully!');
        });
      });
    });
  });
  
  router.get('/:id', ensureAuthenticated, (req, res) => {
    const courseId = req.params.id;
    
    // First, verify the user has access to this course
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
      
      // Now, select content from the content table based on course_id
      db.query(
        `SELECT content_id, course_id, file_name, content_type, uploaded_at
         FROM content
         WHERE course_id = ?
         ORDER BY uploaded_at DESC`,
        [courseId],
        (err, result) => {
          if (err) {
            console.error('Error fetching content:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json(result);
        }
      );
    });
  });
  


  router.get('/view/:contentId', (req, res) => {
    const contentId = req.params.contentId;
  
    db.query('SELECT * FROM content WHERE content_id = ?', [contentId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Content not found' });
      }
  
      const content = results[0];
  
      // Prepare content for the client
      const contentData = {
        content_id: content.content_id,
        course_id: content.course_id,
        file_name: content.file_name,
        file_data: content.file_data.toString('base64'), // Convert to base64
        content_type: content.content_type,
        uploaded_at: content.uploaded_at,
      };
  
      res.json(contentData);
    });
  });

  router.delete(`/remove/:courseId/:contentId` , ensureAuthenticated , ensureInstructor , ensureOwnership, (req,res)=>{
    const contentId = req.params.contentId;
   console.log(`heeeeeeeeeeeeeere`)
    db.query(`delete from content where content_id = ?` , [contentId] , (err , result)=>{
      if (err){ return res.status(500).send(err);}
     res.status(200).send(`it worked`);
    })
  } )
  


module.exports = router;