import React from 'react';
import styles from './User.module.css';
import dot from '../../../../assets/homepage/dot.svg';

const User = () => {
  return (
    <div className={styles.User}>
      <div className={styles.UserName}>
        <div className={styles.Initials}>
          <span className={styles.Letter}>D</span>
        </div>
        <div className={styles.Name}>Dmitry</div>
      </div>
      <div className={styles.Dots}>
        <img src={dot} alt='dot' />
        <img src={dot} alt='dot' />
        <img src={dot} alt='dot' />
      </div>
    </div>
  );
};

export default User;
