const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'letmein',
    database: 'test_lms'
});

// Connect to MySQLz
connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL as ID', connection.threadId);
});



module.exports = connection;
