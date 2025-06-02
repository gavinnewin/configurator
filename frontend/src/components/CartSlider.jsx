// src/components/CartSlider.jsx
import { useState } from 'react';

export default function CartSlider({ cartItems, onQtyChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Redirect into Stripe-hosted Checkout
  const handleCheckout = async () => {
  // 1) Close the cart drawer
  setOpen(false);

  try {
    // 2) Fire off the POST
    const response = await fetch(
      'https://configurator-yjnt.onrender.com/create-checkout-session',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems })
      }
    );

    // 3) Check for network / HTTP errors
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    // 4) Parse the JSON
    const { url } = await response.json();

    // 5) Redirect the user to Stripe Checkout
    window.location.href = url;
  } catch (err) {
    console.error('Checkout failed:', err);
    // Optionally show a toast or set some error state to inform the user
  }
};


  return (
    <>
      {/* Cart icon button (opens drawer) */}
      <button
        className="checkout-btn"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        style={{ position: 'relative' }}
      >
        <i className="bx bx-cart"></i>
        {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
      </button>

      {/* Off-canvas drawer */}
      <aside
        className={`cart-slider${open ? ' open' : ''}`}
        onClick={e => e.target === e.currentTarget && setOpen(false)}
      >
        <button className="cart-close" onClick={() => setOpen(false)}>
          &times;
        </button>
        <h2 id="your-cart">Your Cart</h2>

        <div id="cart-items">
          {cartItems.length === 0 && <p>Your cart is empty.</p>}
          {cartItems.map(item => {
            const thumb = `/images/${item.case.toLowerCase().replace(/\s+/g, '-')}.png`;
            return (
              <div key={item.id} className="cart-item">
                <img src={thumb} alt={item.case} className="cart-thumb" />
                <div className="cart-details">
                  <p><strong>Case:</strong> {item.case}</p>
                  <p><strong>Plate:</strong> {item.plate}</p>
                  <p><strong>Switches:</strong> {item.switches}</p>
                  {item.keycaps && <p><strong>Keycaps:</strong> {item.keycaps}</p>}
                </div>
                <div className="cart-controls">
                  <button onClick={() => onQtyChange(item.id, -1)} className="qty-btn">–</button>
                  <span className="qty">{item.qty}</span>
                  <button onClick={() => onQtyChange(item.id, +1)} className="qty-btn">+</button>
                </div>
                <button onClick={() => onRemove(item.id)} className="remove-btn" aria-label="Remove item">
                  ×
                </button>
              </div>
            );
          })}
        </div>

        {/* Stripe Checkout button */}
        <button
          id="checkout-final"
          className="button"
          onClick={handleCheckout}
          disabled={totalCount === 0}
        >
          Checkout ({totalCount})
        </button>
      </aside>
    </>
  );

}
