// utils/completeOrder.js
import db from '../lib/db';  // Assuming db.js contains your database connection

export default async function updateOrders(ORDER_ID, FIREBASE_UID) {
  try {
    // Step 1: Look up the USER_ID using Firebase_UID
    const userQuery = await db.query('SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?', [FIREBASE_UID]);
    if (userQuery[0].length === 0) {
      throw new Error(`User with Firebase UID ${FIREBASE_UID} not found.`);
    }
    const USER_ID = userQuery[0][0].USER_ID;

    // Step 2: Update the ORDER_STATUS to 'paid'
    const orderUpdateQuery = await db.query(
      'UPDATE ORDERS SET ORDER_STATUS = ? WHERE ORDER_ID = ? AND USER_ID = ?',
      ['paid', ORDER_ID, USER_ID]
    );
    if (orderUpdateQuery.affectedRows === 0) {
      throw new Error(`Order with ID ${ORDER_ID} not found or not associated with user ${FIREBASE_UID}.`);
    }

    // Step 3: Update the TRANSACTION_PAYMENT_STATUS to 'successful'
    const transactionUpdateStatusQuery = await db.query(
      'UPDATE TRANSACTIONS SET TRANSACTION_PAYMENT_STATUS = ? WHERE ORDER_ID = ?',
      ['successful', ORDER_ID]
    );
    if (transactionUpdateStatusQuery.affectedRows === 0) {
      throw new Error(`Transaction for order ${ORDER_ID} not found.`);
    }

    // Step 4: Update the TRANSACTION_PAYMENT_DATE to the time the webhook is received and processed
    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const transactionUpdateTimeQuery = await db.query(
      'UPDATE TRANSACTIONS SET TRANSACTION_PAYMENT_DATE = ? WHERE ORDER_ID = ?',
      [currentTime, ORDER_ID]
    );
    if (transactionUpdateTimeQuery.affectedRows === 0) {
      throw new Error(`Transaction time for order ${ORDER_ID} not updated.`);
    }

    // Step 5: Clear the cart by deleting from CART
    await db.query('DELETE FROM CART WHERE USER_ID = ?', [USER_ID]);
    // cart items are cleared on cascade
    // await db.query('DELETE FROM CARTITEMS WHERE USER_ID = ?', [USER_ID]);  

    console.log(`Order ${ORDER_ID} and associated cart cleared successfully.`);
    return { success: true, message: `Order ${ORDER_ID} updated and cart cleared.` };

  } catch (err) {
    console.error('Error updating order:', err);
    throw new Error('Failed to update order or clear cart');
  }
}
