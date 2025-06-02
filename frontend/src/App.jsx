import React, { useState } from 'react';
import Accordion from './components/Accordion';
import KeyboardPreview from './components/KeyboardPreview';
import CartSlider from './components/CartSlider';
import './style.css';
// import Checkout from './components/Checkout';

const OPTIONS = {
  case: [
    { label: 'Black', color: '#131313' },
    { label: 'White', color: '#f5f5f5' }
  ],
  plate: [
    { label: 'Aluminium', color: '#3c3c41' },
    { label: 'Brass', color: '#c5ab7b' }
  ],
  switches: [
    { label: 'Holy Pandas', color: '#f5caaf' },
    { label: 'Gateron Yellows', color: '#f9d600' }
  ],
  keycaps: [
    { label: 'Green Keycaps', color: '#b9c4b3' }
  ]
};



export default function App() {
  const [selected, setSelected] = useState({ case: null, plate: null, switches: null, keycaps: null });
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false); 

  function handleSelect(field, label) {
    setSelected(prev => ({ ...prev, [field]: label }));
  }

  function addToCart() {
    if(!selected.case || !selected.plate || !selected.switches) return;

    const newItem = {
      id: Date.now(),
      qty: 1,
    ...selected
    };

    setCart(prev => [...prev,newItem])
  }

  // Increase or decrease qty of a given item
function updateQty(itemId, delta) {
  setCart(prev =>
    prev.map(item =>
      item.id === itemId
        ? { ...item, qty: Math.max(1, item.qty + delta) }
        : item
    )
  );
}

// Optionally remove an item entirely
function removeItem(itemId) {
  setCart(prev => prev.filter(item => item.id !== itemId));
}


  return (
    <>
      <header className="header">
        <a href="#" className="logo">
          <img src="/images/Drop_Logo.png" alt="Logo" />
        </a>
        <nav className="navbar">
         {/* CartSlider renders the cart icon button */}
         <CartSlider cartItems={cart} 
         onQtyChange={updateQty}
        onRemove={removeItem}
        onProceed={() => setShowCheckout(true)} 
  />
  
       </nav>
      </header>
{showCheckout ? (                               
       <Checkout cartItems={cart} />
     ) : (
      <main>
        <h1>Keyboard Configurator</h1>
        <h2>DROP CSTM80 MECHANICAL KEYBOARD</h2>

        <section className="configurator">
          <KeyboardPreview selected={selected} />

          <div className="accordion">
            {Object.entries(OPTIONS).map(([field, opts], idx) => (
              <Accordion
                key={field}
                field={field}
                title={`${idx + 1}. ${field.toUpperCase()}`}
                options={opts}
                selected={selected}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div className="button-container">
            <button id="add-to-cart" onClick={addToCart}>ADD TO CART</button>
          </div>

        </section>
      </main>
     )}
    </>
  );
}
