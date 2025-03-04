// pages/api/users/create.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { FIREBASE_UID, USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO USERS (FIREBASE_UID, USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER) VALUES (?, ?, ?, ?, ?, ?)',
        [FIREBASE_UID, USER_EMAIL, USER_FIRST_NAME, USER_LAST_NAME, USER_ADDRESS, USER_PHONE_NUMBER]
      );
      res.status(201).json({ message: 'User created', userId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
