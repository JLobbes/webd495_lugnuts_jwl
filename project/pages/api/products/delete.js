// pages/api/products/delete.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body; // Get id from the request body

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' }); // Return error if no id is passed
    }

    console.log('Received product to delete:', id);

    try {
      const [result] = await db.query('DELETE FROM PRODUCTS WHERE PRODUCT_ID = ?', [id]);
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true, message: 'Product deleted' });
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
