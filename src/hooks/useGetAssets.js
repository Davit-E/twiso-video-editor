import { useCallback, useState, useEffect, useRef } from 'react';
import axios from '../axios-instance';

const useGetAssets = () => {
  const [isGettingAssets, setIsGettingAssets] = useState(false);
  const [assets, setAssets] = useState(null);
  const isMounted = useRef(false);

  const axiosGetAssets = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .get('/images')
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const getAssets = useCallback(async () => {
    setAssets(null);
    setIsGettingAssets(true);
    try {
      const res = await axiosGetAssets();
      if (isMounted.current) setAssets(res.data);
      console.log(res);
    } catch (uploadError) {
      console.log('Error Getting Assets', uploadError);
    } finally {
      if (isMounted.current) setIsGettingAssets(false);
      return;
    }
  }, [axiosGetAssets]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isGettingAssets, getAssets, assets, setAssets };
};

export default useGetAssets;
