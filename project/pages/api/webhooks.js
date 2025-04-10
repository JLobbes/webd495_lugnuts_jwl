import Stripe from 'stripe';
import completeOrder from '../../utils/completeOrder'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to process the raw body
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the entire event to see its structure
  console.log('Stripe Event: ', JSON.stringify(event, null, 2));

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Log the session object to check the metadata
    console.log('Session Data: ', session);

    // Access the metadata for orderID and firebaseUID
    const orderID = session.metadata.order_id;
    const firebaseUID = session.metadata.firebase_uid;

    console.log('Order ID: ', orderID);
    console.log('Firebase UID: ', firebaseUID);

    // Call your completeOrder function with the extracted data
    await completeOrder(orderID, firebaseUID);

    // Optionally, update your database or perform other actions here.
  }

  res.json({ received: true });
}

const buffer = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data, 'utf8'));
    });
    req.on('error', (err) => reject(err));
  });
};
