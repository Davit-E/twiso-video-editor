import React from 'react';
import styles from './Or.module.css';

const Or = () => {
  return (
    <div className={styles.Or}>
      <div className={styles.Line}></div>
      <span className={styles.Text}>or</span>
      <div className={styles.Line}></div>
    </div>
  );
};

export default Or;
