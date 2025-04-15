import mysql from 'mysql2';

// a pool is a set of resuable DBs as opposed to single instance connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,            
  password: process.env.DB_PASS,     
  database: process.env.DB_NAME,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// promisify calls to the DB for simpler code down the line.
const promisePool = pool.promise();

export default promisePool;
