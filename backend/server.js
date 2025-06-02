// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Stripe from 'stripe';
import cors    from 'cors';  
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });



const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173',
    'https://configurator-pearl-eta.vercel.app' }));

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

  // Map your items into Stripe line items
  const line_items = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.case} / ${item.plate} / ${item.switches}` +
              (item.keycaps ? ` / ${item.keycaps}` : ''),
      },
      unit_amount: 100000, // in cents, or compute based on your pricing logic
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${req.headers.origin}/cancel.html`,
  });

  res.json({ url: session.url });
});

app.listen(4242, () => console.log('Server running on port 4242'));
