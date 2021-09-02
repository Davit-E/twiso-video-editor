import React, { useState, useEffect } from 'react';
import styles from './SignUp.module.css';
import google from '../../../assets/auth/google.svg';
import Button from '../Button/Button';
import Or from '../Or/Or';
import Input from '../Input/Input';
import Select from '../Select/Select';
import CheckMail from '../CheckMail/CheckMail';
import { checkEmailValidity } from '../utils/validation';
import { Link } from 'react-router-dom';
import useMagicLink from '../../../hooks/useMagicLink';
import Spinner from '../../../components/Spinner2/Spinner';

const SignUp = ({ authUrl, isLoading, setIsLoading, checkTokenValidity }) => {
  const [isSent, setIsSent] = useState(false);
  const { magicLink, magickRes, magickError } = useMagicLink();
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

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      console.log(token);
      checkTokenValidity(token);
    } else setIsLoading(false);
  }, [checkTokenValidity, setIsLoading]);

  useEffect(() => {
    if (magickRes) setIsSent(true);
  }, [magickRes]);

  useEffect(() => {
    if (magickError) {
      setIsLoading(false);
    }
  }, [magickError, setIsLoading]);

  const createAccountClickHandler = (e) => {
    e.preventDefault();
    let isEmailValid = checkEmailValidity(email.value);
    let isNameValid = name.value.trim() !== '';
    let isWorkTypeValid = workType.value.id !== 'placeholder';
    if (!isEmailValid) {
      setEmail((prevState) => ({ ...prevState, invalid: true }));
    }
    if (!isNameValid) setName((prevState) => ({ ...prevState, invalid: true }));
    if (!isWorkTypeValid) {
      setWorkType((prevState) => ({ ...prevState, invalid: true }));
    }
    if (isEmailValid && isNameValid && isWorkTypeValid) {
      setIsLoading(true);
      let jsonData = JSON.stringify({
        email: email.value,
        firstName: name.value,
        workType: workType.value.type,
      });
      magicLink(jsonData);
    }
  };

  let signUpContent = (
    <div className={styles.SignUp}>
      <h2 className={styles.Heading}>Create Account</h2>
      <p className={styles.Subheading}>
        Already have an account?{' '}
        <Link to={`${authUrl}/sign-in`} className={styles.SignInLink}>
          Sign in
        </Link>
      </p>
      <div className={styles.FormContent}>
        <a
          className={styles.GoogleLink}
          href={`${process.env.REACT_APP_API_BASE_URL_AUTH}/api/v1/auth/google`}
        >
          <Button>
            <img src={google} alt='google' className={styles.GoogleLogo} />
            Sign Up with Google
          </Button>
        </a>
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

  if (isLoading)
    signUpContent = <Spinner size={{ width: '100px', height: '100px' }} />;

  return !isSent ? signUpContent : <CheckMail />;
};

export default SignUp;
