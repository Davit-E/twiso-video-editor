import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useMagicLink = () => {
  const [magickRes, setMagickRes] = useState(null);
  const [magickError, setMagickError] = useState(null);
  const isMounted = useRef(false);
  const axiosMagicLink = useCallback((data) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/send-magic-link', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const magicLink = useCallback(
    async (data) => {
      setMagickRes(null)
      setMagickError(null)
      try {
        const res = await axiosMagicLink(data);
        console.log(res);
        if (isMounted.current) {
          setMagickRes(res.data);
        }
      } catch (err) {
        setMagickError(err)
        console.log('Error Authenticating with Magic Link', err);
      } finally {
        return;
      }
    },
    [axiosMagicLink]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { magicLink, magickRes, magickError };
};

export default useMagicLink;
