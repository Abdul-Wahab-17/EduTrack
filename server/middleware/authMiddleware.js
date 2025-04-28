const db = require(`../db`);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
}

function ensureInstructor(req, res, next) {
    if (req.user && req.user.role === 'instructor') {
        return next();
    }
    res.status(403).json({ message: 'Forbidden: Instructor access required' });
}

function ensureStudent(req , res , next){
    if (req.user && req.user.role === 'student'){
        return next();
    }
    res.status(403).json({message:`Forbidden: Student access required`})
}

function ensureOwnership( req , res , next){

 console.log(`hereeeeeee`)
        var userId = req.user.id;
        var courseId = req.params.courseId;

        db.query(`select instructor_id from instructors where user_id = ?` , [userId] , (err, result)=>{
            if (err){ return res.status(500).send(`db error ` + err)}
            const instructorid = result[0].instructor_id;
    
            db.query(`select instructor_id from courses where course_id = ? ` ,[courseId] , (err,result)=>{
                if (err) { return res.status(500).send(err)}
                if (result.length === 0){
                    console.log(`no course found`)
                    return res.status(404).send(`No course found`);  }
                if ( result[0].instructor_id != instructorid){ return res.status(401).send(`Unauthorized to edit course`);}
                next();
            })
        })
    }


module.exports = {
    ensureAuthenticated,
    ensureInstructor,
    ensureStudent,
    ensureOwnership
};
