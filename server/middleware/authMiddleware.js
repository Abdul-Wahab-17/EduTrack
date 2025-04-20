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
module.exports = {
    ensureAuthenticated,
    ensureInstructor,
    ensureStudent
};
