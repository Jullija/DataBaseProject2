import React from 'react';
import styles from '../styles/Home.module.css';
import ParticleAnimation from './ParticleAnimation';
import CardList from './CardList';

const Home = () => {
  return (
      <div className={styles['home']}>
        <h1>Welcome to the <b>Bit Shop</b></h1>
        <p>
          Browse our collection of high-quality products! Feel free to take a look on our most popular products!
        </p>
        <CardList />
        <div className={styles['particle-canvas']}>
          <ParticleAnimation />
        </div>
      </div>
  );
};

export default Home;
