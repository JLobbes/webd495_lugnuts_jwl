// pages/api/products/create.js
import db from '../../../lib/db';
import { verifyAccessToken } from '../../../utils/verifyAccessToken';
import verifyAdmin from '../../../utils/verifyAdmin'; // Import the verifyAdmin function

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { idToken, firebase_uid } = req.body; 
    const { PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL } = req.body.newProduct;
    
    try {
      // First, verify user's session with Firebase
      await verifyAccessToken(idToken, firebase_uid);
      
      // Second, verify user has 'admin' role
      await verifyAdmin(firebase_uid); // Will throw an error if the user is not admin

      // If admin verification passes, continue with the product creation
      const [result] = await db.query(
        'INSERT INTO PRODUCTS (PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL) VALUES (?, ?, ?, ?, ?, ?)',
        [PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_PRICE, PRODUCT_STOCK, PRODUCT_CATEGORY, PRODUCT_IMAGE_URL]
      );
      res.status(200).json({ message: 'Product created', productId: result.insertId });
    } catch (err) {
      // Handle errors (e.g., admin verification failure or DB errors)
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
  