import React, { useEffect, useState } from 'react';
import styles from './SignIn.module.css';
import google from '../../../assets/auth/google.svg';
import Button from '../Button/Button';
import Or from '../Or/Or';
import Input from '../Input/Input';
import CheckMail from '../CheckMail/CheckMail';
import { checkEmailValidity } from '../utils/validation';
import { Link } from 'react-router-dom';
import useMagicLink from '../../../hooks/useMagicLink';
import Spinner from '../../../components/Spinner2/Spinner';

const SignIn = ({ authUrl, isLoading, setIsLoading, checkTokenValidity }) => {
  const { magicLink, magickRes, magickError } = useMagicLink();
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState({
    value: '',
    invalid: false,
    type: 'email',
    placeholder: 'Email address',
    validation: true,
    errorMessage: 'Please enter your email',
  });

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) checkTokenValidity(token);
    else setIsLoading(false);
  }, [checkTokenValidity, setIsLoading]);

  useEffect(() => {
    if (magickRes) setIsSent(true);
  }, [magickRes]);

  useEffect(() => {
    if (magickError) {
      setIsLoading(false);
    }
  }, [magickError, setIsLoading]);

  const signInClickHandler = (e) => {
    e.preventDefault();
    let isValid = checkEmailValidity(email.value);
    if (!isValid) setEmail((prevState) => ({ ...prevState, invalid: true }));
    else {
      setIsLoading(true);
      let jsonData = JSON.stringify({ email: email.value });
      magicLink(jsonData);
    }
  };

  let signInContent = (
    <div className={styles.SignIn}>
      <h2 className={styles.Heading}>Welcome to Twiso!</h2>
      <p className={styles.Subheading}>
        Don't have an account?{' '}
        <Link to={`${authUrl}/sign-up`} className={styles.SignUpLink}>
          Sign up for free
        </Link>
      </p>
      <div className={styles.FormContent}>
        <a
          className={styles.GoogleLink}
          href={`${process.env.REACT_APP_API_BASE_URL_AUTH}/api/v1/auth/google`}
        >
          <Button>
            <img src={google} alt='google' className={styles.GoogleLogo} />
            Continue with Google
          </Button>
        </a>
        <Or />
        <form className={styles.Form}>
          <Input {...email} setValue={setEmail} />
          <Button onClick={signInClickHandler}>Sign in</Button>
        </form>
      </div>
    </div>
  );
  if (isLoading)
    signInContent = <Spinner size={{ width: '100px', height: '100px' }} />;

  return !isSent ? signInContent : <CheckMail />;
};

export default SignIn;
