// pages/api/users/read_role.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firebase_uid, idToken } = req.body; // Expect body to contain firebase_uid and idToken
    console.log('firebase_uid:', firebase_uid);
    console.log('idToken:', idToken);

    try {
      await verifyAccessToken(idToken, firebase_uid);

      const result = await db.query('SELECT USER_ROLE FROM USERS WHERE FIREBASE_UID = ?', [firebase_uid]);

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('result in backend:', result[0])

      res.status(200).json(result[0]);
    } catch (err) {
      // Handle errors (e.g., token verification failure, database errors)
      res.status(500).json({ error: err.message });
    }
  } else {
    // If the method is not POST, return a 405 Method Not Allowed error
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
