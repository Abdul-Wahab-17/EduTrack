const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '192.168.18.40',
    user: 'root',
    password: 'letmein', 
    database: 'lms'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL as ID', connection.threadId);
});



// Export connection to use it in routes
module.exports = connection;
