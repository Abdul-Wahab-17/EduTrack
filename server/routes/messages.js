const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL pool/connection

router.get('/chats/:username', async (req, res) => {
    const { username } = req.params;
    db.query( `
        SELECT DISTINCT
          CASE
            WHEN sender = ? THEN receiver
            WHEN receiver = ? THEN sender
          END AS username
        FROM messages
        WHERE sender = ? OR receiver = ?
      `, [username , username , username , username] , (err, result)=>{
        if (err){return err;}
        res.json(result)
      })
  });

  router.get('/messages/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    const sql = `
      SELECT id, sender, receiver, message, timestamp
      FROM messages
      WHERE (sender = ? AND receiver = ?)
         OR (sender = ? AND receiver = ?)
      ORDER BY timestamp ASC
    `;
 
    db.query(sql, [user1, user2, user2, user1] , (err , result)=>{
        if (err){ console.log(err);
            res.status(500);
        }
        res.json(result);
    });
     
  });

  router.post('/messages', async (req, res) => {
    const { sender, receiver, message } = req.body;
    const sql = `INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)`;
   
     db.query(sql, [sender, receiver, message] , (err,result)=>{
        if (err){
            console.log(err);
            res.json(500);
        }
        res.json(result);
     });
    
  });
module.exports = router;
