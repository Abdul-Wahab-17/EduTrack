const express = require(`express`);
const router = express.Router();
var db = require(`../db`);

const { ensureAuthenticated, ensureInstructor , ensureStudent } = require('../middleware/authMiddleware');


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

router.get(`/enrolledCourses` , ensureAuthenticated , ensureStudent , (req , res)=>{
    var id = req.user.id;
    console.log(id);
    db.query(`select c.course_id as id , c.title as title from courses c where c.course_id in (select e.course_id from enrolledcourses e where e.student_id = (select s.student_id from students s where s.user_id = ?))` , [id] , (err,result)=>{
        console.log(result);
        
        res.json(result);
    })
})
module.exports = router;