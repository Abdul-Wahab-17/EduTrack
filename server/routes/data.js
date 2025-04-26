const express = require(`express`);
const router = express.Router();
var db = require(`../db`);

const { ensureAuthenticated, ensureInstructor , ensureStudent } = require('../middleware/authMiddleware');

  router.post('/course', ensureAuthenticated, ensureInstructor, (req, res) => {
    const { title, description, price, duration_weeks, status } = req.body;
    const userId = req.user.id;
    
    // First get the instructor ID for this user
    db.query(
      'SELECT instructor_id FROM instructors WHERE user_id = ?',
      [userId],
      (err, result) => {
        if (err || result.length === 0) {
          console.error('Error finding instructor:', err);
          return res.status(400).json({ error: 'Invalid instructor account' });
        }
        
        const instructorId = result[0].instructor_id;
        
        // Now create the course
        db.query(
          `INSERT INTO courses (title, description, instructor_id, price, duration_weeks, status)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [title, description, instructorId, price, duration_weeks, status || 'draft'],
          (err, result) => {
            if (err) {
              console.error('Error creating course:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            res.status(201).json({ 
              id: result.insertId,
              message: 'Course created successfully' 
            });
          }
        );
      }
    );
  });
  
  // Update a course (instructor only)
  router.put('/course/:id', ensureAuthenticated, ensureInstructor, (req, res) => {
    const courseId = req.params.id;
    const { title, description, price, duration_weeks, status } = req.body;
    const userId = req.user.id;
    
    // First verify this instructor owns this course
    db.query(
      `SELECT c.course_id 
       FROM courses c
       JOIN instructors i ON c.instructor_id = i.instructor_id
       WHERE c.course_id = ? AND i.user_id = ?`,
      [courseId, userId],
      (err, result) => {
        if (err) {
          console.error('Error verifying course ownership:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
          return res.status(403).json({ error: 'Not authorized to update this course' });
        }
        
        // Now update the course
        db.query(
          `UPDATE courses 
           SET title = ?, description = ?, price = ?, duration_weeks = ?, status = ?, updated_at = CURRENT_TIMESTAMP
           WHERE course_id = ?`,
          [title, description, price, duration_weeks, status, courseId],
          (err, result) => {
            if (err) {
              console.error('Error updating course:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({ message: 'Course updated successfully' });
          }
        );
      }
    );
  });
  
  // Student enrolls in a course
  router.post('/enroll', ensureAuthenticated, ensureStudent, (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;
    
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
  
  // Get course content (posts, assignments, quizzes, etc)
  
  // Create course content (post/announcement/lecture/etc)
  router.post('/course/:id/content', ensureAuthenticated, ensureInstructor, (req, res) => {
    const courseId = req.params.id;
    const { content_type, title, content } = req.body;
    const userId = req.user.id;
    
    // Verify this instructor owns this course
    db.query(
      `SELECT c.course_id 
       FROM courses c
       JOIN instructors i ON c.instructor_id = i.instructor_id
       WHERE c.course_id = ? AND i.user_id = ?`,
      [courseId, userId],
      (err, result) => {
        if (err) {
          console.error('Error verifying course ownership:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
          return res.status(403).json({ error: 'Not authorized to add content to this course' });
        }
        
        // Create the post entry first
        db.query(
          `INSERT INTO post (timeOfPost, postcol, courses_course_id) 
           VALUES (CURRENT_TIMESTAMP, ?, ?)`,
          [title, courseId],
          (err, result) => {
            if (err) {
              console.error('Error creating post:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            const postId = result.insertId;
            
            // Now create the specific content type
            let specificQuery;
            let specificParams;
            
            switch(content_type) {
              case 'announcement':
                specificQuery = 'INSERT INTO announcements (post_post_id) VALUES (?)';
                specificParams = [postId];
                break;
              case 'quiz':
                specificQuery = 'INSERT INTO quizes (post_post_id) VALUES (?)';
                specificParams = [postId];
                break;
              case 'assignment':
                specificQuery = 'INSERT INTO assignments (post_post_id) VALUES (?)';
                specificParams = [postId];
                break;
              case 'lecture':
                specificQuery = 'INSERT INTO lectures (post_post_id) VALUES (?)';
                specificParams = [postId];
                break;
              case 'slide':
                specificQuery = 'INSERT INTO slides (post_post_id) VALUES (?)';
                specificParams = [postId];
                break;
              default:
                // Just a regular post, no additional entry needed
                return res.status(201).json({
                  id: postId,
                  message: 'Content created successfully'
                });
            }
            
            db.query(specificQuery, specificParams, (err, result) => {
              if (err) {
                console.error(`Error creating ${content_type}:`, err);
                // Try to rollback the post creation
                db.query('DELETE FROM post WHERE post_id = ?', [postId]);
                return res.status(500).json({ error: 'Database error' });
              }
              
              let contentId = null;
              if (result.insertId) {
                contentId = result.insertId;
              }
              
              res.status(201).json({
                id: postId,
                content_id: contentId,
                message: 'Content created successfully'
              });
            });
          }
        );
      }
    );
  });
  
  // Submit assignment (student only)
  router.post('/assignment/:id/submit', ensureAuthenticated, ensureStudent, (req, res) => {
    const assignmentId = req.params.id;
    const { submission_content } = req.body;
    const userId = req.user.id;
    
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
        
        // Verify the student is enrolled in the course containing this assignment
        db.query(
          `SELECT e.enrollment_id 
           FROM enrolledcourses e
           JOIN courses c ON e.course_id = c.course_id
           JOIN post p ON c.course_id = p.courses_course_id
           JOIN assignments a ON p.post_id = a.post_post_id
           WHERE a.assignment_id = ? AND e.student_id = ?`,
          [assignmentId, studentId],
          (err, result) => {
            if (err) {
              console.error('Error verifying enrollment:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.length === 0) {
              return res.status(403).json({ error: 'Not enrolled in the course' });
            }
            
            // Insert the submission
            // Note: Your schema doesn't include submission content columns
            // This is a placeholder - you'll need to add appropriate columns
            db.query(
              'INSERT INTO assignment_submission (assignments_assignment_id) VALUES (?)',
              [assignmentId],
              (err, result) => {
                if (err) {
                  console.error('Error submitting assignment:', err);
                  return res.status(500).json({ error: 'Database error' });
                }
                
                res.status(201).json({ 
                  id: result.insertId,
                  message: 'Assignment submitted successfully' 
                });
              }
            );
          }
        );
      }
    );
  });
  
  // Take quiz (student only)
  router.post('/quiz/:id/submit', ensureAuthenticated, ensureStudent, (req, res) => {
    const quizId = req.params.id;
    const { answers } = req.body;
    const userId = req.user.id;
    
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
        
        // Verify the student is enrolled in the course containing this quiz
        db.query(
          `SELECT e.enrollment_id 
           FROM enrolledcourses e
           JOIN courses c ON e.course_id = c.course_id
           JOIN post p ON c.course_id = p.courses_course_id
           JOIN quizes q ON p.post_id = q.post_post_id
           WHERE q.quiz_id = ? AND e.student_id = ?`,
          [quizId, studentId],
          (err, result) => {
            if (err) {
              console.error('Error verifying enrollment:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.length === 0) {
              return res.status(403).json({ error: 'Not enrolled in the course' });
            }
            
            // Insert the submission
            // Note: Your schema doesn't include submission content columns
            // This is a placeholder - you'll need to add appropriate columns
            db.query(
              'INSERT INTO quiz_submission (quizes_quiz_id) VALUES (?)',
              [quizId],
              (err, result) => {
                if (err) {
                  console.error('Error submitting quiz:', err);
                  return res.status(500).json({ error: 'Database error' });
                }
                
                res.status(201).json({ 
                  id: result.insertId,
                  message: 'Quiz submitted successfully' 
                });
              }
            );
          }
        );
      }
    );
  });
  
  // Update course progress (student only)
  router.put('/course/:id/progress', ensureAuthenticated, ensureStudent, (req, res) => {
    const courseId = req.params.id;
    const { progress } = req.body;
    const userId = req.user.id;
    
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
        
        // Update the enrollment progress
        db.query(
          `UPDATE enrolledcourses 
           SET progress = ?
           WHERE student_id = ? AND course_id = ?`,
          [progress, studentId, courseId],
          (err, result) => {
            if (err) {
              console.error('Error updating progress:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            
            if (result.affectedRows === 0) {
              return res.status(404).json({ error: 'Enrollment not found' });
            }
            
            res.json({ message: 'Progress updated successfully' });
          }
        );
      }
    );
  });




module.exports = router;