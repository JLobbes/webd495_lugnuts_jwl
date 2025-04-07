import Stripe from 'stripe';
import { verifyAccessToken } from '../../../utils/verifyAccessToken'; 
import db from '../../../lib/db'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { firebase_uid, idToken, cartItems, ORDER_TOTAL_AMOUNT, ORDER_SHIPPING_ADDRESS, phoneNumber } = req.body;

    try {
      // Step 1: Verify Firebase ID Token
      await verifyAccessToken(idToken, firebase_uid);

      // Step 2: Create the Order in your DB
      const ORDER_DATE = new Date().toISOString().replace('T', ' ').replace('Z', '');
      const ORDER_STATUS = 'pending';
      
      // Ensure all required fields are present
      if (!ORDER_DATE || !ORDER_TOTAL_AMOUNT || !ORDER_STATUS || !ORDER_SHIPPING_ADDRESS) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get USER_ID using firebase_uid
      const idQuery = await db.query(
        'SELECT USER_ID FROM USERS WHERE FIREBASE_UID = ?',
        [firebase_uid]
      );
      const USER_ID = idQuery[0][0].USER_ID;

      // Insert the order into the database with the correct USER_ID
      const order = await db.query(
        'INSERT INTO ORDERS (USER_ID, ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS) VALUES (?, ?, ?, ?, ?)',
        [USER_ID, ORDER_DATE, ORDER_TOTAL_AMOUNT, ORDER_STATUS, ORDER_SHIPPING_ADDRESS]
      );
      const ORDER_ID = order[0].insertId;

      // Step 3: Add Order Items to the DB
      for (let item of cartItems) {
        const orderItemData = {
          PRODUCT_ID: item.PRODUCT_ID,
          ORDER_ITEM_QUANTITY: item.CART_ITEM_QUANTITY,
          ORDER_ITEM_PRICE: item.PRODUCT_PRICE,
        };

        const priceQuery = await db.query(
          'SELECT PRODUCT_PRICE FROM PRODUCTS WHERE PRODUCT_ID = ?',
          [orderItemData.PRODUCT_ID]
        )
        orderItemData.ORDER_ITEM_PRICE = priceQuery[0][0].PRODUCT_PRICE;

        await db.query(
          'INSERT INTO ORDERITEMS (ORDER_ID, PRODUCT_ID, ORDER_ITEM_QUANTITY, ORDER_ITEM_PRICE) VALUES (?, ?, ?, ?)',
          [ORDER_ID, orderItemData.PRODUCT_ID, orderItemData.ORDER_ITEM_QUANTITY, orderItemData.ORDER_ITEM_PRICE]
        );
      }

      // Step 4: Create the Transaction
      const transactionData = {
        TRANSACTION_PAYMENT_STATUS: 'pending',
        TRANSACTION_PAYMENT_METHOD: 'stripe',
        TRANSACTION_PAYMENT_DATE: new Date().toISOString().replace('T', ' ').replace('Z', ''),
      };

      await db.query(
        'INSERT INTO TRANSACTIONS (ORDER_ID, TRANSACTION_PAYMENT_STATUS, TRANSACTION_PAYMENT_METHOD, TRANSACTION_PAYMENT_DATE) VALUES (?, ?, ?, ?)',
        [ORDER_ID, transactionData.TRANSACTION_PAYMENT_STATUS, transactionData.TRANSACTION_PAYMENT_METHOD, transactionData.TRANSACTION_PAYMENT_DATE]
      );

      // Step 5: Create the Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Payment for Order: ${ORDER_ID}`,
            },
            unit_amount: Math.round(ORDER_TOTAL_AMOUNT * 100), // Total price in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/cancel`,
        metadata: {
          firebase_uid: firebase_uid,
          order_id: ORDER_ID,
        },
      });

      // Step 6: Send the sessionId to frontend
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error during checkout preparation:', error);
      res.status(500).json({ error: 'Failed to prepare checkout' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
