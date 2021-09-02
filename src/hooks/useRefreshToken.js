import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance-auth';

const useRefreshToken = () => {
  const [newToken, setNewToken] = useState(null);
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
    setNewToken(null)
    setRefreshError(null)
    try {
      const res = await axiosRefreshToken();
      console.log(res);
      if (isMounted.current) {
        setNewToken(res.data.accessToken);
      }
    } catch (err) {
      setRefreshError(err)
      console.log('Error Refreshing Token', err);
    } finally {
      return;
    }
  }, [axiosRefreshToken]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { refreshToken, newToken, refreshError };
};

export default useRefreshToken;
