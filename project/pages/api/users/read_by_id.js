// pages/api/users/read_by_id.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [result] = await db.query('SELECT * FROM USERS WHERE USER_ID = ?', [id]);
      if (result.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(result[0]);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
