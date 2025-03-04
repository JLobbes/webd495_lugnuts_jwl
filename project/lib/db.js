import mysql from 'mysql2';

// a pool is a set of resuable DBs as opposed to single instance connections
const pool = mysql.createPool({
  host: 'localhost',        // local for now, ClearDB after Deployment??
  user: 'root',             // on my machine
  password: 'bananas',      // on my machine
  database: 'lugnuts_db',  // relevant name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// promisify calls to the DB for simpler code down the line.
const promisePool = pool.promise();

export default promisePool;
