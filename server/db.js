const mysql = require('mysql2');

// Connection settings come from the environment (see ../.env.example); the defaults suit local development.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edutrack',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
