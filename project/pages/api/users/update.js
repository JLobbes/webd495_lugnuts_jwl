// pages/api/users/update.js
import db from '../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const { USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER } = req.body;

  if (req.method === 'PUT') {
    try {
      const [result] = await db.query(
        'UPDATE USERS SET USER_EMAIL = ?, USER_FIRST_NAME = ?, USER_LAST_NAME = ?, USER_ADDRESS = ?, USER_PHONE_NUMBER = ? WHERE USER_ID = ?',
        [USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER, id]
      );
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'User updated' });
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
