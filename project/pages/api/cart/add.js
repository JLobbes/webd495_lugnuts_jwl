import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firebase_uid, product_id, quantity } = req.body;

    if (!firebase_uid || !product_id || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Step 1: Retrieve the USER_ID based on the FIREBASE_UID
      const [userResult] = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult[0].USER_ID;

      // Step 2: Check if the user already has a cart, otherwise create a new cart
      const [cartResult] = await db.query(
        'SELECT CART_ID FROM CART WHERE USER_ID = ?',
        [userId]
      );

      let cartId;
      if (cartResult.length === 0) {
        // No existing cart, create a new one
        const [createCartResult] = await db.query(
          'INSERT INTO CART (USER_ID) VALUES (?)',
          [userId]
        );
        cartId = createCartResult.insertId;
      } else {
        cartId = cartResult[0].CART_ID;
      }

      // Step 3: Add product to CARTITEMS table or update quantity if already present
      const [cartItemResult] = await db.query(
        'SELECT CART_ITEM_ID, CART_ITEM_QUANTITY FROM CARTITEMS WHERE CART_ID = ? AND PRODUCT_ID = ?',
        [cartId, product_id]
      );

      if (cartItemResult.length === 0) {
        // No existing cart item, create a new one
        await db.query(
          'INSERT INTO CARTITEMS (CART_ID, PRODUCT_ID, CART_ITEM_QUANTITY, CART_ITEM_ADDED_AT) VALUES (?, ?, ?, NOW())',
          [cartId, product_id, quantity]
        );
      } else {
        // Cart item exists, update the quantity
        const newQuantity = cartItemResult[0].CART_ITEM_QUANTITY + quantity;
        await db.query(
          'UPDATE CARTITEMS SET CART_ITEM_QUANTITY = ? WHERE CART_ITEM_ID = ?',
          [newQuantity, cartItemResult[0].CART_ITEM_ID]
        );
      }

      res.status(200).json({ message: 'Product added to cart' });
    } catch (err) {
      console.error('Error adding to cart:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
