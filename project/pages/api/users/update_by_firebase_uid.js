// pages/api/users/update_by_firebase_uid.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query; // id is the Firebase UID
  const { USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER } = req.body;

  if (req.method === 'PUT') {
    try {
      const [user] = await db.query(
        'SELECT * FROM USERS WHERE FIREBASE_UID = ?',
        [id] // id is Firebase UID passed in the query
      );

      // if no user , return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const [result] = await db.query(
        'UPDATE USERS SET USER_EMAIL = ?, USER_FIRST_NAME = ?, USER_LAST_NAME = ?, USER_ADDRESS = ?, USER_PHONE_NUMBER = ? WHERE FIREBASE_UID = ?',
        [USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER, id] // id is Firebase UID
      );

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'User updated' });
      } else {
        res.status(404).json({ error: 'User update failed' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
