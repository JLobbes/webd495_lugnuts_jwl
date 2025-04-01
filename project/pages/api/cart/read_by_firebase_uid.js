import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { firebase_uid, idToken } = req.query;

    if (!firebase_uid || !idToken) {
      return res.status(400).json({ error: 'Missing firebase_uid or idToken' });
    }

    try {
      await verifyAccessToken(idToken, firebase_uid);

      const [userResult] = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult[0].USER_ID;

      // fetch the user's cart items
      const [cartItems] = await db.query(
        'SELECT p.PRODUCT_ID, ci.CART_ITEM_QUANTITY FROM CARTITEMS ci JOIN PRODUCTS p ON ci.PRODUCT_ID = p.PRODUCT_ID WHERE ci.CART_ID IN (SELECT CART_ID FROM CART WHERE USER_ID = ?)',
        [userId]
      );

      res.status(200).json(cartItems);
    } catch (err) {
      console.error('Error fetching cart items:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    // Handle non-GET requests
    res.status(405).json({ error: 'Method not allowed' });
  }
}
