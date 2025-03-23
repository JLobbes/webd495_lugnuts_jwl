import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { firebase_uid } = req.query;

    if (!firebase_uid) {
      return res.status(400).json({ error: 'missing firebase_uid' });
    }

    try {
      // get user ID from firebase_uid
      const [userResult] = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'user not found' });
      }

      const userId = userResult[0].USER_ID;

      // get all cart items for this user
      const [cartItems] = await db.query(
        'SELECT p.PRODUCT_ID, ci.CART_ITEM_QUANTITY FROM CARTITEMS ci JOIN PRODUCTS p ON ci.PRODUCT_ID = p.PRODUCT_ID WHERE ci.CART_ID IN (SELECT CART_ID FROM CART WHERE USER_ID = ?) ',
        [userId]
      );

      res.status(200).json(cartItems);
    } catch (err) {
      console.error('error fetching cart items:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    // handle non-GET requests
    res.status(405).json({ error: 'method not allowed' });
  }
}
