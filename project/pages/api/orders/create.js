// /pages/api/orders/create.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS } = req.body.orderData;
    const { idToken, firebase_uid } = req.body;
    console.log('idToken:', idToken);
    console.log('firebase_uid:', firebase_uid);

    // Ensure all required fields are present
    if (!ORDER_DATE || !ORDER_TOTAL_AMOUNT || !ORDER_STATUS || !ORDER_SHIPPING_ADDRESS) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // First: Verify request comes from signed in user
      await verifyAccessToken(idToken, firebase_uid);

      // Get USER_ID using firebase_uid
      const idQuery = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );
      const USER_ID = idQuery[0][0].USER_ID;
      console.log('USER_ID:', USER_ID);

      // Insert the order into the database with the correct USER_ID
      const [result] = await db.query(
        'INSERT INTO ORDERS (USER_ID, ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS) VALUES (?, ?, ?, ?, ?)',
        [USER_ID, ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS]
      );

      res.status(200).json({ message: 'Order created successfully', ORDER_ID: result.insertId });
    } catch (err) {
      console.error('Error creating order:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
