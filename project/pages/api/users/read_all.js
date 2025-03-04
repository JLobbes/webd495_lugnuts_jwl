// pages/api/users/read_all.js
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [result] = await db.query('SELECT * FROM USERS');
      res.status(200).json(result);  // Sends all users as an array
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
