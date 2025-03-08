// pages/api/products/create.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL } = req.body;

    try {
      const [result] = await db.query(
        'INSERT INTO PRODUCTS (PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL) VALUES (?, ?, ?, ?, ?, ?)',
        [PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL]
      );
      res.status(201).json({ message: 'Product created', productId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
