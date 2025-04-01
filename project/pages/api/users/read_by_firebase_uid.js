// pages/api/users/read_by_firebase_uid.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firebase_uid, idToken } = req.body; // Expect body to contain firebase_uid and idToken

    try {
      // Step 1: Verify Access Token
      await verifyAccessToken(idToken, firebase_uid);

      // Step 2: Query by FIREBASE_UID
      const [result] = await db.query('SELECT * FROM USERS WHERE FIREBASE_UID = ?', [firebase_uid]);

      if (result.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

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
