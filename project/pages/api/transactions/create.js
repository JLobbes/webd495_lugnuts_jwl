import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ORDER_ID, TRANSACTION_PAYMENT_STATUS, TRANSACTION_PAYMENT_METHOD, TRANSACTION_PAYMENT_DATE } = req.body;

    if (!ORDER_ID || !TRANSACTION_PAYMENT_STATUS || !TRANSACTION_PAYMENT_METHOD || !TRANSACTION_PAYMENT_DATE) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // create a new transaction
      await db.query(
        'INSERT INTO TRANSACTIONS (ORDER_ID, TRANSACTION_PAYMENT_STATUS, TRANSACTION_PAYMENT_METHOD, TRANSACTION_PAYMENT_DATE) VALUES (?, ?, ?, ?)',
        [ORDER_ID, TRANSACTION_PAYMENT_STATUS, TRANSACTION_PAYMENT_METHOD, TRANSACTION_PAYMENT_DATE]
      );

      res.status(200).json({ message: 'Transaction created successfully' });
    } catch (err) {
      console.error('Error creating transaction:', err.message);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
