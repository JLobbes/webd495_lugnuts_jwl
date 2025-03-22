// pages/api/users/read_by_firebase_uid.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query; 

  if (req.method === 'GET') {
    try {
      // query by FIREBASE_UID
      const [result] = await db.query('SELECT * FROM USERS WHERE FIREBASE_UID = ?', [id]);

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(result[0]);
    } catch (err) {
      // database errors
      res.status(500).json({ error: err.message });
    }
  } else {
    // If the method is not GET, return a 405 Method Not Allowed error
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
