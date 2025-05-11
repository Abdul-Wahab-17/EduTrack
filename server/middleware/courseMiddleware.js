const db = require(`../db`);

const checkStudents = (req , res, next)=>{
    const {courseId} = req.body;
    db.query(` select * from enrolledCourses ec where course_id = ? and status not in ('completed' , 'dropped') ` , [courseId] , (err,result)=>{
        if (err){
            return res.status(500).send(`db error`);
        }
        if (result.length > 0){
            return res.status(400).send(`the course has enrolled students`);
        }
        return next();
    })
}

const ensureEnrollment = (req,res,next)=>{
    const id = req.user.id;
    const courseId = req.params.courseId;

    const query = `select ec.enrollment_id from enrolledCourses ec where course_id = ? and student_id = (select student_id from students where user_id = ?)`
    db.query(query , [courseId , id] , (err , result)=>{
        if (err){ return res.status(500).send(`db error`);}
        if (result.length === 0){ return res.status(401).send(`you need to enroll in this course first`);}
        next();
    })
}

module.exports = {checkStudents , ensureEnrollment}