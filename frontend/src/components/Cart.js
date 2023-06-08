import React, { useState, useEffect } from 'react';
import { getBasketItems } from "../modules/user";

const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchBasketItems = async () => {
      const basketItems = await getBasketItems();
      setItems(basketItems);
    };

    fetchBasketItems();
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              Item: {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
