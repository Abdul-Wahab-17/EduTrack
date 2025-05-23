var express = require('express');
var router = express.Router();
const db = require('../db');
var crypto = require('crypto');
var localStrategy = require('passport-local');
var passport = require('passport');

const { ensureAuthenticated } = require('../middleware/authMiddleware');

passport.use(new localStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM users WHERE username = ?', [username], function(err, results) {
        if (err) return cb(err);

        if (results.length === 0) {
            console.error("❌ No user found with username:", username);
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        const row = results[0];
        console.log(row);

        if (!row.password || !row.salt) {
            console.error("❌ Missing password or salt in database");
            return cb(new Error("Database missing required fields"));
        }

       const storedHash = row.password;
       const storedSalt = row.salt;

        // Hash input password using the stored salt
        crypto.pbkdf2(password, storedSalt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) return cb(err);

            if (!crypto.timingSafeEqual(storedHash  , hashedPassword)) {
                console.error("❌ Hash mismatch: Incorrect password");
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.user_id, username: user.username, role: user.user_type });
    });
});


passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('hiiiiiiiiiii');
});

router.post('/logout',ensureAuthenticated, (req, res) => {
    req.logout(function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send('Logout failed');
      }
      // Destroy session completely
      req.session.destroy((err) => {
        if (err) {
          console.log('Session destruction error:', err);
          return res.status(500).send('Session destruction failed');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie (important)
        res.send('Logged out successfully');
      });
    });
  });

router.get('/check', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('user is authenticated ' + req.user.username + ' with the role: ' + req.user.role + ` with the id: ` + req.user.id);
        res.json({ authenticated: true, user: req.user, role: req.user.user_type });
    } else {
        console.log('user is not authenticated');
        res.json({ authenticated: false });
    }
});

router.get('/role', ensureAuthenticated, (req, res) => {
    console.log(req.user.role);
    res.send(req.user.role);
});

router.post('/register', (req, res, next) => {
    const { username, password, email, role , bio , profilePic } = req.body;
    console.log(req.body);
    const query = 'INSERT INTO users (username, password, salt, email, user_type , display_name,bio,profile_picture_url) VALUES (?, ?, ?, ?, ? , ?,?,?)';

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) { throw err; }
        if (results.length !== 0) {
            return res.status(400).send('Username already exists');
        }

        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, derivedKey) => {
            if (err) throw err;
            db.query(query, [username, derivedKey, salt, email, role , username , bio , profilePic], (err, results) => {
                if (err) { throw err; }
                const user = { id: results.insertId, username: username, role: role };
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    const user = {  username: username, role: role };

                    if(role === `student`){
                        db.query( `insert into students (user_id , full_name ) values ( ${results.insertId} , ? )` , [username] , (err , result)=>{
                            if (err){
                                db.query(`delete from users where user_id = ?` , [results.insertId] , (err,result)=>{
                                    res.status(500).send(`db error`);
                                })
                            }
                          return   res.status(200).json( {user:user});
                        })

                    }
                    else if(role === `instructor`){
                        db.query( `insert into instructors (user_id , full_name ) values ( ${results.insertId} , ? )` , [username ] , (err , result)=>{

                            if (err){
                                db.query(`delete from users where user_id = ?` , [results.insertId] , (err,result)=>{
                                    res.status(500).send(`db error`);
                                })
                            }
                          return   res.status(200).json( {user:user});
                        })

                    }
                });
            });
        });
    });
});

module.exports = router;
