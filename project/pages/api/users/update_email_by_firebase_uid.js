// pages/api/users/update_by_firebase_uid.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken';

export default async function handler(req, res) {
  const { idToken, firebase_uid, USER_EMAIL } = req.body; 

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

      const [result] = await db.query(
        'UPDATE USERS SET USER_EMAIL = ? WHERE FIREBASE_UID = ?',
        [USER_EMAIL, firebase_uid] 
      );

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'User email synced with Firebase' });
      } else {
        res.status(404).json({ error: 'User email sync with Firebase failed' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
