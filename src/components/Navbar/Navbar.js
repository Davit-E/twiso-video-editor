import React from 'react';
import styles from './Navbar.module.css';
import backArrow from '../../assets/editor/backArrow.svg';
import { Link, useHistory } from 'react-router-dom';

const Navbar = ({ children, videoData, isPreview }) => {
  const history = useHistory();
  const backHandler = () => history.goBack();

  return (
    <header className={styles.Navbar}>
      <div className={styles.BackFileInfoContainer}>
        <div className={styles.BackButton} onClick={backHandler}>
          <img className={styles.BackArrow} src={backArrow} alt='back' />
        </div>
        {videoData && !isPreview ? (
          <div className={styles.FileInfoContainer}>
            <p className={styles.FileName}>{videoData.title}</p>
            <p className={styles.Creater}>Dmitry</p>
          </div>
        ) : null}
        {isPreview ? (
          <Link to={`/editor/${videoData.id}`} className={styles.EditVideo}>
            Edit video
          </Link>
        ) : null}
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
