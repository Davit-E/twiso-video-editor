import React, { useState } from 'react';
import styles from './Auth.module.css';
import saly from '../../assets/auth/saly.png';
import twiso from '../../assets/auth/twiso.svg';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import CheckMail from './CheckMail/CheckMail';

const Auth = ({ setIsAuthenticated, isSent, setIsSent }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  let authComponent = isSignIn ? (
    <SignIn setIsSignIn={setIsSignIn} setIsSent={setIsSent} />
  ) : (
    <SignUp setIsSignIn={setIsSignIn} setIsSent={setIsSent} />
  );

  return (
    <div className={styles.Auth}>
      <div className={styles.Testimonial}>
        <div className={styles.Background}></div>
        <div className={styles.TestimonialContent}>
          <img src={twiso} alt='twiso' className={styles.Twiso} />
          <p className={styles.Heading}>Transcribe. Edit. Design.</p>
          <p className={styles.Subheading}>All in on one place.</p>
          <img src={saly} alt='saly' className={styles.Mascot} />
        </div>
      </div>
      <div className={styles.Account}>
        {isSent ? (
          <CheckMail setIsAuthenticated={setIsAuthenticated} />
        ) : (
          authComponent
        )}
      </div>
    </div>
  );
};

export default Auth;
