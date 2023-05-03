import React from 'react';
import styles from '../styles/Product.module.css';

const Product = ({ product }) => {
  return (
    <div className={styles['product']}>
      <h3>{product.item}</h3>
      <p>Price: {product.price}$</p>
    </div>
  );
};

export default Product;
