// pages/utils/verifyAdmin.js
import db from '../lib/db';  // Import your DB utility

export default async function verifyAdmin(firebase_uid) {
  try {
    const result = await db.query('SELECT USER_ROLE FROM USERS WHERE FIREBASE_UID = ?', [firebase_uid]);
    const role = result[0][0].USER_ROLE;

    if (role !== 'admin') {
      throw new Error('User NOT admin. Unauthorized');
    }

    console.log('User verified as:', role);
    return true;
  } catch (err) {
    throw new Error(err.message); // Return error if query fails
  }
}
