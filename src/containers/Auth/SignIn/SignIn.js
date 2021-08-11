import React, { useState } from 'react';
import styles from './SignIn.module.css';
import google from '../../../assets/auth/google.svg';
import Button from '../Button/Button';
import Or from '../Or/Or';
import Input from '../Input/Input';
import CheckMail from '../CheckMail/CheckMail';
import { checkEmailValidity } from '../utils/validation';
import { Link } from 'react-router-dom';

const SignIn = ({ authUrl }) => {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState({
    value: '',
    invalid: false,
    type: 'email',
    placeholder: 'Email address',
    validation: true,
    errorMessage: 'Please enter your email',
  });

  const signInClickHandler = (e) => {
    e.preventDefault();
    let isValid = checkEmailValidity(email.value);
    if (!isValid) setEmail((prevState) => ({ ...prevState, invalid: true }));
    else setIsSent(true);
  };

  const signInWithGoogleClickHandler = (e) => {
    console.log('Sign in with google');
  };

  const signInContent = (
    <div className={styles.SignIn}>
      <h2 className={styles.Heading}>Welcome to Twiso!</h2>
      <p className={styles.Subheading}>
        Don't have an account?{' '}
        <Link to={`${authUrl}/sign-up`} className={styles.SignUpLink}>
          Sign up for free
        </Link>
      </p>
      <div className={styles.FormContent}>
        <Button onClick={signInWithGoogleClickHandler}>
          <img src={google} alt='google' className={styles.GoogleLogo} />
          Continue with Google
        </Button>
        <Or />
        <form className={styles.Form}>
          <Input {...email} setValue={setEmail} />
          <Button onClick={signInClickHandler}>Sign in</Button>
        </form>
      </div>
    </div>
  );

  return !isSent ? signInContent : <CheckMail />;
};

export default SignIn;
