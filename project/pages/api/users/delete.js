// pages/api/users/delete.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const [result] = await db.query('DELETE FROM USERS WHERE USER_ID = ?', [id]);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'User deleted' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
