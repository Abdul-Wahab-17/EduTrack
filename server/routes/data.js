const express = require(`express`);
const router = express.Router();
var db = require(`../db`);

const { ensureAuthenticated, ensureInstructor , ensureStudent } = require('../middleware/authMiddleware');



  router.get(`/` , ensureAuthenticated ,(req,res)=>{

    db.query(`select * from users where user_id = ?` , [req.user.id] , (err , result)=>{
      if (err){ return res.status(500).send(`error`)}
      if (result.length ===0 ){ return res.status(404).send(`user not found`); }

      return res.json( {
        "profilePic":result[0].profile_picture_url,
        "email":result[0].email,
        "joinDate":result[0].created_at,
        "bio":result[0].bio,
        "displayName":result[0].display_name
      })
    })
  })
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


  // Create course content (post/announcement/lecture/etc)
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