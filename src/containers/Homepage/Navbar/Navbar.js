import React from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <header className={styles.Navbar}>
      <Link className={styles.NewButton} to='/editor/new'>
        <span className={styles.Plus}>+</span>New Project
      </Link>
    </header>
  );
};

export default Navbar;
