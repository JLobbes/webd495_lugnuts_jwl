import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    // check for required fields
    const { firebase_uid, product_id, removeComplete } = req.body;

    if (!firebase_uid || !product_id) {
      return res.status(400).json({ error: 'missing required fields' });
    }

    try {
      // fetch user ID based on firebase UID
      const [userResult] = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'user not found' });
      }

      const userId = userResult[0].USER_ID;

      // fetch user's cart ID
      const [cartResult] = await db.query(
        'SELECT CART_ID FROM CART WHERE USER_ID = ?',
        [userId]
      );

      if (cartResult.length === 0) {
        return res.status(404).json({ error: 'cart not found' });
      }

      const cartId = cartResult[0].CART_ID;

      // check if the product is in the cart
      const [cartItemResult] = await db.query(
        'SELECT CART_ITEM_ID, CART_ITEM_QUANTITY FROM CARTITEMS WHERE CART_ID = ? AND PRODUCT_ID = ?',
        [cartId, product_id]
      );

      if (cartItemResult.length === 0) {
        return res.status(404).json({ error: 'product not found in cart' });
      }

      const currentQuantity = cartItemResult[0].CART_ITEM_QUANTITY;

      if (removeComplete) {
        // completely remove item from cart
        await db.query(
          'DELETE FROM CARTITEMS WHERE CART_ITEM_ID = ?',
          [cartItemResult[0].CART_ITEM_ID]
        );
        res.status(200).json({ message: 'product removed from cart completely' });
      } else if (currentQuantity > 1) {
        // decrement quantity by 1
        await db.query(
          'UPDATE CARTITEMS SET CART_ITEM_QUANTITY = CART_ITEM_QUANTITY - 1 WHERE CART_ITEM_ID = ?',
          [cartItemResult[0].CART_ITEM_ID]
        );
        res.status(200).json({ message: 'product quantity decreased by 1' });
      } else {
        // if quantity is 1, remove item completely
        await db.query(
          'DELETE FROM CARTITEMS WHERE CART_ITEM_ID = ?',
          [cartItemResult[0].CART_ITEM_ID]
        );
        res.status(200).json({ message: 'product removed from cart completely' });
      }
    } catch (err) {
      console.error('error removing from cart:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    // handle non-DELETE requests
    res.status(405).json({ error: 'method not allowed' });
  }
}
