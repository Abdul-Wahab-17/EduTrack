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

module.exports = checkStudents