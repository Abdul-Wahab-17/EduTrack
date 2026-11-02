const express = require('express');
const router = express.Router();
const db = require('../db');
const { ensureAuthenticated, ensureInstructor } = require('../middleware/authMiddleware');

// Instructor dashboard numbers: totals, enrolments and revenue per month, and the top courses.
// Revenue is the course price at the time of reading, summed over its enrolments.
router.get('/instructor', ensureAuthenticated, ensureInstructor, (req, res) => {
  const mine = 'c.instructor_id = (SELECT instructor_id FROM instructors WHERE user_id = ?)';
  const userId = req.user.id;

  const totals = `
    SELECT COUNT(DISTINCT c.course_id) AS courseCount,
           COUNT(DISTINCT e.student_id) AS totalStudents,
           COALESCE(SUM(c.price), 0) AS totalRevenue,
           COALESCE(AVG(e.rating), 0) AS averageRating
    FROM courses c LEFT JOIN enrolledcourses e ON e.course_id = c.course_id
    WHERE ${mine}`;
  const monthly = `
    SELECT DATE_FORMAT(e.enrolled_at, '%Y-%m') AS month, COUNT(*) AS enrollments, COALESCE(SUM(c.price), 0) AS revenue
    FROM enrolledcourses e JOIN courses c ON c.course_id = e.course_id
    WHERE ${mine}
    GROUP BY month ORDER BY month`;
  const top = `
    SELECT c.title, COUNT(e.enrollment_id) AS enrollments
    FROM courses c LEFT JOIN enrolledcourses e ON e.course_id = c.course_id
    WHERE ${mine}
    GROUP BY c.course_id, c.title ORDER BY enrollments DESC, c.title LIMIT 5`;

  db.query(totals, [userId], (err, t) => {
    if (err) return res.status(500).json({ message: 'Failed to load analytics' });
    db.query(monthly, [userId], (err, m) => {
      if (err) return res.status(500).json({ message: 'Failed to load analytics' });
      db.query(top, [userId], (err, c) => {
        if (err) return res.status(500).json({ message: 'Failed to load analytics' });
        res.json({
          stats: {
            totalStudents: Number(t[0].totalStudents),
            totalRevenue: Number(t[0].totalRevenue),
            averageRating: Number(t[0].averageRating),
            courseCount: Number(t[0].courseCount),
          },
          charts: {
            monthlyEnrollments: m.map(r => ({ month: r.month, enrollments: Number(r.enrollments) })),
            monthlyRevenue: m.map(r => ({ month: r.month, revenue: Number(r.revenue) })),
            topCourses: c.map(r => ({ title: r.title, enrollments: Number(r.enrollments) })),
          },
        });
      });
    });
  });
});

module.exports = router;
