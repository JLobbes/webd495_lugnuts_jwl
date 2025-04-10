// pages/api/orders/read_by_firebase_uid.js
import db from '../../../lib/db'; 
import { verifyAccessToken } from '../../../utils/verifyAccessToken'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { firebase_uid, idToken } = req.body;

  const user = await verifyAccessToken(idToken, firebase_uid); 

  try {
    const userQuery = await db.query('SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?', [firebase_uid]);
    if (userQuery[0].length === 0) {
      throw new Error(`User with Firebase UID ${firebase_uid} not found.`);
    }
    const USER_ID = userQuery[0][0].USER_ID;

    // const orders = await db.query(
    //   `SELECT * FROM ORDERS WHERE USER_ID = ? ORDER BY ORDER_DATE DESC`,
    //   [USER_ID]
    // );

    const orders = await db.query(
      `SELECT o.ORDER_ID, o.ORDER_STATUS, o.ORDER_DATE, o.ORDER_SHIPPING_ADDRESS,
              o.ORDER_TOTAL_AMOUNT, t.TRANSACTION_PAYMENT_STATUS, t.TRANSACTION_PAYMENT_DATE
      FROM ORDERS o
      JOIN TRANSACTIONS t ON o.ORDER_ID = t.ORDER_ID
      WHERE USER_ID = ? 
      ORDER BY ORDER_DATE DESC`,
      [USER_ID]
    );

    console.log('orders:', orders);

    const fullOrders = await Promise.all(orders[0].map(async (order) => {
      const orderItems = await db.query(
        `SELECT oi.ORDER_ITEM_QUANTITY, p.* 
         FROM ORDERITEMS oi
         JOIN PRODUCTS p ON oi.PRODUCT_ID = p.PRODUCT_ID
         WHERE oi.ORDER_ID = ?`,
        [order.ORDER_ID]
      );

      return {
        ...order,
        items: orderItems[0]
      };
    }));

    console.log('full orders:', fullOrders);

    res.status(200).json(fullOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
}
