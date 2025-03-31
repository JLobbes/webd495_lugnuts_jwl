// pages/api/products/update.js
import db from '../../../lib/db';

export default async function handler(req, res) {

  if (req.method === 'PUT') {
    const { PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL, PRODUCT_ID } = req.body;

    try {
      const [result] = await db.query(
        'UPDATE PRODUCTS SET PRODUCT_NAME = ?, PRODUCT_DESCRIPTION = ?, PRODUCT_PRICE = ?, PRODUCT_STOCK = ?, PRODUCT_CATEGORY = ?, PRODUCT_IMAGE_URL = ? WHERE PRODUCT_ID = ?',
        [PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL, PRODUCT_ID]
      );
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Product updated' });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
