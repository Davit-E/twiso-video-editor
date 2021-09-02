import React, { useCallback, useEffect, useState, useContext } from 'react';
import styles from './Auth.module.css';
import saly from '../../assets/auth/saly.png';
import twiso from '../../assets/auth/twiso.svg';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import Token from './Token/Token';
import {
  useRouteMatch,
  useHistory,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import setAuthToken from '../../utils/setAuthToken';
import useRefreshToken from '../../hooks/useRefreshToken';
import UserContext from '../../contexts/UserContext';

const Auth = () => {
  const { userDispatch } = useContext(UserContext);
  const { refreshToken, newToken, refreshError } = useRefreshToken();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const match = useRouteMatch();
  const history = useHistory();
  const checkTokenValidity = useCallback(
    (token) => {
      setIsLoading(true);
      setAuthToken(token);
      refreshToken();
    },
    [refreshToken]
  );

  useEffect(() => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);
      userDispatch({ type: 'setIsAuthenticated', data: true });
    } else if (refreshError) {
      localStorage.removeItem('token');
      setIsLoading(false);
      history.replace(`/sign-in`);
    }
  }, [newToken, refreshError, userDispatch, history, match]);

  useEffect(() => {
    if (token) checkTokenValidity(token);
  }, [token, checkTokenValidity]);

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
          <Route exact path={`${match.path}`}>
            <Token setToken={setToken} />
          </Route>
          <Route exact path={`${match.path}/sign-in`}>
            <SignIn
              authUrl={match.path}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              checkTokenValidity={checkTokenValidity}
              token={token}
            />
          </Route>
          <Route exact path={`${match.path}/sign-up`}>
            <SignUp
              authUrl={match.path}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              checkTokenValidity={checkTokenValidity}
              token={token}
            />
          </Route>
          <Redirect to={`${match.path}/sign-in`} />
        </Switch>
      </div>
    </div>
  );
};

export default Auth;
