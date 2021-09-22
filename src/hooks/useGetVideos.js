import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useGetVideos = () => {
  const [isGettingVideos, setIsGettingVideos] = useState(false);
  const [videos, setVideos] = useState(false);
  const isMounted = useRef(false);

  const axiosGetVideos = useCallback(() => {
    return new Promise((resolve, reject) => {
      axios
        .get('/videos')
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const getVideos = useCallback(async () => {
    setIsGettingVideos(true);
    try {
      const res = await axiosGetVideos();
      if (isMounted.current) setVideos(res.data);
      console.log(res);
    } catch (err) {
      console.log('Error Getting Videos', err);
    } finally {
      if (isMounted.current) setIsGettingVideos(false);
      return;
    }
  }, [axiosGetVideos]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isGettingVideos, getVideos, videos };
};



export default useGetVideos;
