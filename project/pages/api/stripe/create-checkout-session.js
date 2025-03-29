import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { orderTotalAmount, user } = req.body;

    console.log('Received orderTotalAmount:', orderTotalAmount);
    console.log('Received user data:', user);

    try {
      // create a new Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd', 
              product_data: {
                name: 'Order Total', 
              },
              unit_amount: orderTotalAmount * 100, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/success`, 
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/transactions/cancel`, 
        metadata: {
          user_id: user.uid, // user info for later use (e.g., to update the transaction)
        },
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
