// pages/api/users/update_by_firebase_uid.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken';

export default async function handler(req, res) {
  const { idToken, firebase_uid } = req.body; 
  const { USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER } = req.body;

  if (req.method === 'POST') {
    try {
      await verifyAccessToken(idToken, firebase_uid);

      const [user] = await db.query(
        'SELECT * FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid] // the ? item is firebase_uid
      );

      // if no user, return error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // ensure role remains unchanged
      const userRole = await db.query(
        'SELECT USER_ROLE FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid] // the ? item is firebase_uid
      );

      const [result] = await db.query(
        'UPDATE USERS SET USER_EMAIL = ?, USER_FIRST_NAME = ?, USER_LAST_NAME = ?, USER_ADDRESS = ?, USER_PHONE_NUMBER = ?, USER_ROLE = ? WHERE FIREBASE_UID = ?',
        [USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER, userRole.USER_ROLE, firebase_uid] 
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
