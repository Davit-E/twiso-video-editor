import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useGetPublicVideo = () => {
  const [isGettingPublicVideo, setIsGettingPublicVideo] = useState(false);
  const [publicInfo, setPublicInfo] = useState(null);
  const [getPublicVideoError, setGetPublicVideoError] = useState(null);
  const isMounted = useRef(false);

  const axiosGetPublicVideo = useCallback((id) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/public/videos/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const getPublicVideo = useCallback(
    async (id) => {
      setGetPublicVideoError(null);
      setIsGettingPublicVideo(true);
      try {
        const res = await axiosGetPublicVideo(id);
        if (isMounted.current) {
          setPublicInfo({
            finalUrl: res.data.final_video_url || null,
            title: res.data.title,
          });
        }
        console.log(res);
      } catch (err) {
        if (isMounted.current) setGetPublicVideoError(err);
        console.log('Error Getting Public Video', err);
      } finally {
        if (isMounted.current) setIsGettingPublicVideo(false);
        return;
      }
    },
    [axiosGetPublicVideo]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return {
    isGettingPublicVideo,
    getPublicVideo,
    publicInfo,
    getPublicVideoError,
  };
};

export default useGetPublicVideo;
