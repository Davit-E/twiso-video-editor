import React from 'react';
import styles from './Navbar.module.css';
import backArrow from '../../assets/editor/backArrow.svg';
import { Link, useHistory } from 'react-router-dom';
import twiso from '../../assets/preview/twiso.svg';

const Navbar = ({ children, videoData, isPreview, getVideoError, isAuth }) => {
  const history = useHistory();
  const backHandler = () => history.goBack();

  return (
    <header className={styles.Navbar}>
      <div className={styles.BackFileInfoContainer}>
        {isAuth || !isPreview ? (
          <div className={styles.BackButton} onClick={backHandler}>
            <img className={styles.BackArrow} src={backArrow} alt='back' />
          </div>
        ) : null}
        {!isAuth && isPreview ? (
          <img className={styles.Twiso} src={twiso} alt='twiso' />
        ) : null}

        {videoData && !isPreview ? (
          <div className={styles.FileInfoContainer}>
            <p className={styles.FileName}>{videoData.title}</p>
            <p className={styles.Creater}>Dmitry</p>
          </div>
        ) : null}
        {isPreview && isAuth && !getVideoError ? (
          <Link to={`/editor/${videoData.id}`} className={styles.EditVideo}>
            Edit video
          </Link>
        ) : null}
      </div>
      {children}
      {!isAuth && isPreview ? (
        <div className={styles.UserInfoContainer}>
          <Link to={'/auth/sign-in'} className={styles.LogInLink}>
            Log in
          </Link>
          <Link to={'/auth/sign-up'} className={styles.SignUpLink}>
            Get Twiso for free
          </Link>
        </div>
      ) : null}
      {isAuth || !isPreview ? (
        <div className={styles.UserInfoContainer}>
          <div className={styles.User}>
            <p className={styles.UserInitials}>DE</p>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
