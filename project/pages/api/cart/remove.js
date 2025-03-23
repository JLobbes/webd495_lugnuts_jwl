import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    // if no delete method, won't process, security
    const { firebase_uid, product_id } = req.body;

    if (!firebase_uid || !product_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const [userResult] = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult[0].USER_ID;

      // this section can be removed? it's for error checking only.
      const [cartResult] = await db.query(
        'SELECT CART_ID FROM CART WHERE USER_ID = ?',
        [userId]
      );

      if (cartResult.length === 0) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      const cartId = cartResult[0].CART_ID;

      const [cartItemResult] = await db.query(
        'SELECT CART_ITEM_ID FROM CARTITEMS WHERE CART_ID = ? AND PRODUCT_ID = ?',
        [cartId, product_id]
      );

      if (cartItemResult.length === 0) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }

      await db.query(
        'DELETE FROM CARTITEMS WHERE CART_ITEM_ID = ?',
        [cartItemResult[0].CART_ITEM_ID]
      );

      res.status(200).json({ message: 'Product removed from cart' });
    } catch (err) {
      console.error('Error removing from cart:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
