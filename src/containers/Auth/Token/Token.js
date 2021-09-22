import React, { useCallback, useEffect, useState } from 'react';
import styles from './Token.module.css';
import Spinner from '../../../components/Spinner2/Spinner';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom';

const Token = ({ setToken }) => {
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const getToken = useCallback(() => {
    return new URLSearchParams(location.search).get('token');
  }, [location]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      let tokenParam = getToken();
      if (tokenParam) {
        localStorage.setItem('token', tokenParam);
        setToken(tokenParam);
      } else history.push(`${match.path}/sign-in`);
    }
  }, [getToken, setToken, history, match, isFirstLoad]);

  return (
    <div className={styles.Token}>
      <Spinner style={{ width: '100px', height: '100px' }} />
    </div>
  );
};

export default Token;
