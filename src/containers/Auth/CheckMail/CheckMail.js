import React from // useContext
'react';
import styles from './CheckMail.module.css';
// import UserContext from '../../../contexts/UserContext';
import mail from '../../../assets/auth/mail.svg';

const CheckMail = () => {
  // const { userDispatch } = useContext(UserContext);
  // const clickHandler = () => {
  //   userDispatch({ type: 'setIsAuthenticated', data: true });
  // };

  return (
    <div className={styles.CheckMail}>
      <img src={mail} alt='mail' className={styles.Mail} />
      <h2 className={styles.Heading}>Check your inbox</h2>
      <p className={styles.Subheading}>
        We sent you an activation link. Please be sure to check your spam folder
        too.
      </p>
      {/* <div className={styles.EditorLink} onClick={clickHandler}>
        Go to editor
      </div> */}
    </div>
  );
};

export default CheckMail;
