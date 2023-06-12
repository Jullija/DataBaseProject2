import React from 'react';
import styles from '../styles/CardList.module.scss';
import { Link } from 'react-router-dom';
import Products from './Products';

const cards = [
  {
    title: 'Laptops',
    copy: 'Portability meets power - elevate your on-the-go experience',
    button: 'Check now',
  },
  {
    title: 'Phones',
    copy: 'Cutting-edge smartphones for seamless connection and entertainment',
    button: 'Check now',
  },
  {
    title: 'Computers',
    copy: "High-performance PCs for work, gaming, and creativity",
    button: 'Check now',
  },
  {
    title: 'Headphones',
    copy: 'Immerse in clear sound and comfort for music enthusiasts',
    button: 'Check now',
  },
];

const Card = ({ title, copy, button }) => (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.copy}>{copy}</p>
        <button className={styles.btn}>  <Link to="/products">{button}</Link> </button>
      </div>
    </div>
);
  
const CardList = () => (
    <div className={styles.pageContent} id='Cards'>
      {cards.map((card) => (
        <Card key={card.title} title={card.title} copy={card.copy} button={card.button} />
      ))}
    </div>
);

export default CardList;
