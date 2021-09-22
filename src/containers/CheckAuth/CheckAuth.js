import { useCallback, useEffect, useState, useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import useRefreshToken from '../../hooks/useRefreshToken';
import { useHistory, useRouteMatch } from 'react-router-dom';

const CheckAuth = () => {
  const { userDispatch } = useContext(UserContext);
  const { refreshToken, newToken, refreshError } = useRefreshToken();
  const [isAuthLoading, setAuthIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const [token, setToken] = useState(null);
  const history = useHistory();
  const match = useRouteMatch();

  const checkTokenValidity = useCallback(
    (token) => {
      setAuthIsLoading(true);
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
      setAuthIsLoading(false);
      history.replace(`/sign-in`);
    }
  }, [newToken, refreshError, userDispatch, history, match]);

  useEffect(() => {
    if (token) checkTokenValidity(token);
  }, [token, checkTokenValidity]);

  return null;
};

export default CheckAuth;
