import React from 'react';
import styles from './Navbar.module.css';
import backArrow from '../../assets/editor/backArrow.svg';
import { useHistory } from 'react-router-dom';

const Navbar = ({ children }) => {
  const history = useHistory();

  return (
    <header className={styles.Navbar}>
      <div className={styles.BackFileInfoContainer}>
        <div className={styles.BackButton} onClick={() => history.goBack()}>
          <img className={styles.BackArrow} src={backArrow} alt='back' />
        </div>
        <div className={styles.FileInfoContainer}>
          <p className={styles.FileName}>Untitled</p>
          <p className={styles.Creater}>Dmitry</p>
        </div>
      </div>
      {children}
      <div className={styles.UserInfoContainer}>
        <div className={styles.User}>
          <p className={styles.UserInitials}>DE</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
