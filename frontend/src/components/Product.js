import React, { useState, useEffect } from 'react';
import styles from '../styles/Product.module.css';
import { isLoggedIn } from '../modules/user.js';

const Product = ({ product, onRemove, onBuy }) => {
  const [isLoggedInStatus, setIsLoggedInStatus] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await isLoggedIn();
      setIsLoggedInStatus(status);
    };

    checkLoginStatus();
  }, []);

  return (
    <div className={styles['product']}>
<img className={styles['img']} src={`https://images.unsplash.com/photo-${product.image_link}?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ`} alt={product.product_name} />      <h3>{product.product_name}</h3>
      <p className={styles['p']}>{product.product_type}</p>
      <p>${product.product_price}</p>
      <p>{product.product_description}</p>
      <p>Quantity: {product.product_quantity}</p>
      {isLoggedInStatus && <div className={styles['button']} onClick={() => onBuy(product._id, -1)}>BUY</div>}
      <button onClick={() => onRemove(product._id)} className={styles['button']}>Remove</button>
    </div>
  );
};

export default Product;