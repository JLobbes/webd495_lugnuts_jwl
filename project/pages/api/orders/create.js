// /pages/api/orders/create.js
import db from '../../../lib/db';

// Function to get the USER_ID using the firebase_uid from the /api/users/read_by_firebase_uid API
const getUserIdFromFirebaseUid = async (firebaseUid) => {
  const response = await fetch(`http://localhost:3000/api/users/read_by_firebase_uid?id=${firebaseUid}`);

  if (!response.ok) {
    throw new Error('User not found');
  }

  const user = await response.json();
  return user.USER_ID;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { FIREBASE_UID, ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS } = req.body;

    // Debugging: Log incoming data
    console.log('Received Order Data:', req.body);

    // Ensure all required fields are present
    if (!FIREBASE_UID || !ORDER_DATE || !ORDER_TOTAL_AMOUNT || !ORDER_STATUS || !ORDER_SHIPPING_ADDRESS) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Fetch the USER_ID using FIREBASE_UID from the /api/users/read_by_firebase_uid API
      const USER_ID = await getUserIdFromFirebaseUid(FIREBASE_UID);

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
