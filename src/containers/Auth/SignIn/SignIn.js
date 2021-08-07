import React, { useState } from 'react';
import styles from './SignIn.module.css';
import google from '../../../assets/auth/google.svg';
import Button from '../Button/Button';
import Or from '../Or/Or';
import Input from '../Input/Input';
import { checkEmailValidity } from '../utils/validation';

const SignIn = ({ setIsSignIn, setIsSent }) => {
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
    else setIsSent(true)
  };

  const signInWithGoogleClickHandler = (e) => {
    console.log('Sign in with google');
  };

  return (
    <div className={styles.SignIn}>
      <h2 className={styles.Heading}>Welcome to Twiso!</h2>
      <p className={styles.Subheading}>
        Don't have an account?{' '}
        <span className={styles.SignUpLink} onClick={() => setIsSignIn(false)}>
          Sign up for free
        </span>
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
};

export default SignIn;
