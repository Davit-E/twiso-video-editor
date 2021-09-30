import { useEffect, useCallback, useRef, useState } from 'react';
import setAuthToken from '../utils/setAuthToken';
import axios from '../axios-instance';

const useCheckAuth = () => {
  const [newToken, setNewToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [refreshError, setRefreshError] = useState(null);
  const isMounted = useRef(false);

  const axiosRefreshToken = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .get('/refresh-token')
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const refreshToken = useCallback(async () => {
    setNewToken(null);
    setRefreshError(null);
    try {
      const res = await axiosRefreshToken();
      console.log(res);
      if (isMounted.current) {
        setNewToken(res.data.accessToken);
      }
    } catch (err) {
      setRefreshError(err);
      console.log('Error Refreshing Token', err);
    } finally {
      return;
    }
  }, [axiosRefreshToken]);

  const checkTokenValidity = useCallback(
    (token) => {
      setIsChecking(true);
      setAuthToken(token);
      refreshToken();
    },
    [refreshToken]
  );

  useEffect(() => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);
      setIsAuth(true);
    } else if (refreshError) {
      localStorage.removeItem('token');
    }
    setIsChecking(false);
  }, [newToken, refreshError]);

  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) checkTokenValidity(token);
    else {
      setIsChecking(false);
      setIsAuth(false);
    }
  }, [checkTokenValidity]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isChecking, isAuth };
};

export default useCheckAuth;
