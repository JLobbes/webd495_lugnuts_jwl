// pages/api/products/update.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken';
import verifyAdmin from '../../../utils/verifyAdmin'; // Import the verifyAdmin function

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { idToken, firebase_uid } = req.body; 
    const { PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL, PRODUCT_ID } = req.body.editProduct;

    try {
      // First, verify user's session with Firebase
      await verifyAccessToken(idToken, firebase_uid);
            
      // Second, verify user has 'admin' role
      await verifyAdmin(firebase_uid); // Will throw an error if the user is not admin

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
