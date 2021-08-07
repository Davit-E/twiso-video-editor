import React from 'react';
import styles from './CheckMail.module.css';
import mail from '../../../assets/auth/mail.svg';
const CheckMail = ({ setIsAuthenticated }) => {
  return (
    <div className={styles.CheckMail}>
      <img src={mail} alt='mail' className={styles.Mail} />
      <h2 className={styles.Heading}>Check your inbox</h2>
      <p className={styles.Subheading}>
        We sent you an activation link. Please be sure to check your spam folder
        too.
      </p>
      <div
        className={styles.EditorLink}
        onClick={() => setIsAuthenticated(true)}
      >
        Go to editor
      </div>
    </div>
  );
};

export default CheckMail;
