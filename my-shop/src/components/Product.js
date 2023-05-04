import React from 'react';
import styles from '../styles/Product.module.css';

const Product = ({ product, onRemove }) => {
  return (
    <div className={styles['product']}>
     <img src={`https://images.unsplash.com/photo-${product.image_link}?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ`} alt={product.product_name} />
      <h3>{product.product_name}</h3>
      <h3>{product.image_link}</h3>
      <p>{product.product_type}</p>
      <p>${product.product_price}</p>
      <p>{product.product_description}</p>
      <button onClick={() => onRemove(product._id)}>Remove</button>
    </div>
  );
};

export default Product;
