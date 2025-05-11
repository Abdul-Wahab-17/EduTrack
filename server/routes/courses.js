var express =require(`express`);
var router = express.Router();
var db = require(`../db`);

const {ensureAuthenticated , ensureInstructor , ensureStudent, ensureOwnership } = require(`../middleware/authMiddleware`);
const {checkStudents , ensureEnrollment} = require("../middleware/courseMiddleware");

router.get(`/enrolledCourses`, ensureAuthenticated, ensureStudent, (req, res) => {
  const id = req.user.id;
  const query = `
    SELECT
      c.course_id AS id,
      c.title AS title,
      i.full_name,
      c.image_url,
      ec.status,
      ec.progress
    FROM
      courses c
    JOIN instructors i ON c.instructor_id = i.instructor_id
    JOIN enrolledCourses ec ON c.course_id = ec.course_id
    JOIN students s ON s.student_id = ec.student_id
    WHERE s.user_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching enrolled courses:', err);
      return res.status(500).send('Database error');
    }

    // Formatting response to send the correct field names
    const formattedResult = result.map(course => ({
      id: course.id,
      title: course.title,
      instructor_name: course.instructor_name,  // Sending instructor name
      image_url: course.image_url,
      status: course.status,
      progress: course.progress
    }));

    res.status(200).json(formattedResult);
  });
});

router.get('/unenrolledCourses', ensureAuthenticated, ensureStudent, (req, res) => {
  const id = req.user.id;

  const query = `
    SELECT
      c.course_id AS id,
      c.title AS title
    FROM
      courses c
    WHERE
      c.course_id NOT IN (
        SELECT f.course_id
        FROM enrolledCourses f
        WHERE f.student_id = (
          SELECT s.student_id
          FROM students s
          WHERE s.user_id = ?
        )
      )
    AND c.status = 'published'`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching unenrolled courses:', err);
      return res.status(500).send('Database error');
    }

    // Formatting response
    const formattedResult = result.map(course => ({
      id: course.id,
      title: course.title
    }));

    res.status(200).json(formattedResult);
  });
});


router.get(`/`, ensureAuthenticated, ensureInstructor, (req, res) => {
  const id = req.user.id;
  const courseId = req.query.courseId;

  // Use explicit JOINs for better readability
  const query = `
    SELECT
      c.course_id AS id,
      c.image_url,
      c.title,
      c.duration_weeks,
      c.description,
      c.price,
      c.status,
      c.category
    FROM
      courses c
    JOIN
      instructors i ON i.instructor_id = c.instructor_id
    WHERE
      i.instructor_id = (SELECT instructor_id FROM instructors j WHERE j.user_id = ? and c.course_id = ?)
  `;

  db.query(query, [id,courseId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    res.status(200).json(result);
  });
});




router.get('/course/:courseId', ensureAuthenticated , ensureInstructor , ensureOwnership, (req, res) => {
    const courseId = req.params.courseId;

    db.query(
      `SELECT c.course_id as id, c.title, c.description, c.price, c.duration_weeks,
      c.status, c.created_at, i.instructor_id, u.username as instructor_name,
      u.bio as instructor_bio
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

        res.status(200).json(result[0]);
      }
    );
  });


  router.get('/enrolled/:courseId', ensureAuthenticated , ensureStudent , ensureEnrollment, (req, res) => {
    const courseId = req.params.courseId;

    db.query(
      `SELECT c.course_id as id, c.title, c.description, c.price, c.duration_weeks,
      c.status, c.created_at, i.instructor_id, u.username as instructor_name,
      u.bio as instructor_bio
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

        res.status(200).json(result[0]);
      }
    );
  });

router.get('/ownedCourses', ensureAuthenticated, ensureInstructor, (req, res) => {
  const id = req.user.id; // Assuming `instructor_id` is part of `req.user`

  db.query(
    `SELECT c.course_id as id, c.title, c.description,c.duration_weeks, c.price, c.status, c.image_url,
      u.username as instructor_name
    FROM courses c
    JOIN instructors i ON c.instructor_id = i.instructor_id
    JOIN users u ON u.user_id = i.user_id
    WHERE i.user_id = ?`, // Filter by the current instructor's ID
    [id], // Pass the instructor's ID as a parameter to avoid SQL injection
    (err, result) => {
      if (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(result); // Return all courses for the instructor
    }
  );
});


  router.post('/createcourse', ensureAuthenticated, ensureInstructor, (req, res) => {
    const userId = req.user.id;

    // Query to get the instructor_id from the user_id
    const instructorQuery = 'SELECT instructor_id FROM Instructors WHERE user_id = ?';

    db.query(instructorQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching instructor ID:', err);
        return res.status(500).json({ error: 'Failed to identify instructor' });
      }

      if (results.length === 0) {
        return res.status(403).json({ error: 'User is not a valid instructor' });
      }

      const instructorId = results[0].instructor_id;

      const {
        title,
        description,
        price = 0.00,  // default to 0.00 if price is not provided
        duration_weeks = null,  // optional
        status = 'draft',  // default to draft if not provided
        image_url = null  // optional
      } = req.body;

      // Validation
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and Description are required fields' });
      }

      // Prepare the insert query
      const insertQuery = `
        INSERT INTO Courses (
          instructor_id,
          title,
          description,
          price,
          duration_weeks,
          status,
          image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      // Values for the insert query
      const values = [
        instructorId,
        title,
        description,
        price,
        duration_weeks,
        status,
        image_url || null
      ];

      // Insert data into the database
      db.query(insertQuery, values, (insertErr, result) => {
        if (insertErr) {
          console.error('Error inserting course:', insertErr);
          return res.status(500).json({ error: 'Failed to create course' });
        }

        // Return a success response with the course ID
        res.status(201).json({
          message: 'Course created successfully',
          courseId: result.insertId
        });
      });
    });
  });


router.put('/:courseId/edit', ensureAuthenticated , ensureInstructor , ensureOwnership , async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    description,
    price,
    duration_weeks,
    status,
    image_url,
    category,
  } = req.body;

  try {
    const updateQuery = `
      UPDATE courses
      SET
        title = ?,
        description = ?,
        price = ?,
        duration_weeks = ?,
        status = ?,
        image_url = ?,
        category = ?,
        updated_at = NOW()
      WHERE course_id = ?
    `;
    await db.query(updateQuery, [
      title,
      description,
      price,
      duration_weeks,
      status,
      image_url,
      category,
      courseId,
    ]);

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


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


router.post( `/delete` , ensureAuthenticated , ensureInstructor , ensureOwnership , checkStudents,(req,res)=>{
  var {courseId} = req.body;
  db.query(`delete from courses where course_id = ?` , [courseId] , (err,result)=>{
    if (err){
      return res.status(500).send(`db error`);
    }
    return res.status(200).send(`course deleted successfully`);
  })
})

module.exports = router;