import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ORDER_ID, PRODUCT_ID, ORDER_ITEM_QUANTITY, ORDER_ITEM_PRICE } = req.body;

    // Validate required fields
    if (!ORDER_ID || !PRODUCT_ID || !ORDER_ITEM_QUANTITY || !ORDER_ITEM_PRICE) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Insert the order item into the database
      await db.query(
        'INSERT INTO ORDERITEMS (ORDER_ID, PRODUCT_ID, ORDER_ITEM_QUANTITY, ORDER_ITEM_PRICE) VALUES (?, ?, ?, ?)',
        [ORDER_ID, PRODUCT_ID, ORDER_ITEM_QUANTITY, ORDER_ITEM_PRICE]
      );

      res.status(200).json({ message: 'Product added to order' });
    } catch (err) {
      console.error('Error adding product to order:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
