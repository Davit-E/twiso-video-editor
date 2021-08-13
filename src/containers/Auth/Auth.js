import React from 'react';
import styles from './Auth.module.css';
import saly from '../../assets/auth/saly.png';
import twiso from '../../assets/auth/twiso.svg';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

const Auth = () => {
  const match = useRouteMatch();

  return (
    <div className={styles.Auth}>
      <div className={styles.Testimonial}>
        <div className={styles.Background}></div>
        <div className={styles.TestimonialContent}>
          <img src={twiso} alt='twiso' className={styles.Twiso} />
          <p className={styles.Heading}>Transcribe. Edit. Design.</p>
          <p className={styles.Subheading}>All in one place.</p>
          <img src={saly} alt='saly' className={styles.Mascot} />
        </div>
      </div>
      <div className={styles.Account}>
        <Switch>
          <Route exact path={`${match.path}/sign-in`}>
            <SignIn authUrl={match.path} />
          </Route>
          <Route exact path={`${match.path}/sign-up`}>
            <SignUp authUrl={match.path} />
          </Route>
          <Redirect to={`${match.path}/sign-in`} />
        </Switch>
      </div>
    </div>
  );
};

export default Auth;
