import React, { useState } from 'react';
import styles from './SignUp.module.css';
import google from '../../../assets/auth/google.svg';
import Button from '../Button/Button';
import Or from '../Or/Or';
import Input from '../Input/Input';
import Select from '../Select/Select';
import { checkEmailValidity } from '../utils/validation';

const SignUp = ({ setIsSignIn, setIsSent }) => {
  const [name, setName] = useState({
    value: '',
    invalid: false,
    type: 'text',
    placeholder: 'First name',
    errorMessage: 'Please enter your name',
  });

  const [email, setEmail] = useState({
    value: '',
    invalid: false,
    type: 'email',
    placeholder: 'Email address',
    errorMessage: 'Please enter your email',
  });

  const [workType, setWorkType] = useState({
    value: { type: 'What kind of work do you do?', id: 'placeholder' },
    options: [
      { type: 'What kind of work do you do?', id: 'placeholder' },
      { type: 'Marketing', id: 'marketing' },
      { type: 'Design', id: 'design' },
      { type: 'Influencer', id: 'influencer' },
      { type: 'Public Speaker', id: 'publicSpeaker' },
      { type: 'Student', id: 'student' },
      { type: 'Other', id: 'other' },
    ],
    invalid: false,
    errorMessage: 'Please fill out this field',
  });

  const createAccountClickHandler = (e) => {
    e.preventDefault();
    let isEmailValid = checkEmailValidity(email.value);
    let isNameValid = name.value.trim() !== '';
    let isWorkTypeValid = workType.value.id !== 'placeholder';
    if (!isEmailValid) {
      setEmail((prevState) => ({ ...prevState, invalid: true }));
    }
    if (!isNameValid) setName((prevState) => ({ ...prevState, invalid: true }));
    if (!isWorkTypeValid)
      setWorkType((prevState) => ({ ...prevState, invalid: true }));
    if (isEmailValid && isNameValid && isWorkTypeValid)
      setIsSent(true);
  };

  const signUpWithGoogleClickHandler = (e) => {
    console.log('Sign up with google');
  };

  return (
    <div className={styles.SignUp}>
      <h2 className={styles.Heading}>Create Account</h2>
      <p className={styles.Subheading}>
        Already have an account?{' '}
        <span className={styles.SignUpLink} onClick={() => setIsSignIn(true)}>
          Sign in
        </span>
      </p>
      <div className={styles.FormContent}>
        <Button onClick={signUpWithGoogleClickHandler}>
          <img src={google} alt='google' className={styles.GoogleLogo} />
          Sign Up with Google
        </Button>
        <Or />
        <form className={styles.Form}>
          <Input {...name} setValue={setName} />
          <Input {...email} setValue={setEmail} />
          <Select {...workType} setValue={setWorkType} />
          <Button onClick={createAccountClickHandler}>Create Account</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
