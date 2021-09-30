import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useGetVideo = () => {
  const [isGettingVideo, setIsGettingVideo] = useState(false);
  const [info, setInfo] = useState(null);
  const [getVideoError, setGetVideoError] = useState(null);
  const words = useRef(null);
  const isMounted = useRef(false);

  const axiosGetVideo = useCallback((id) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/videos/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const getVideo = useCallback(
    async (id) => {
      setGetVideoError(null);
      setIsGettingVideo(true);
      try {
        const res = await axiosGetVideo(id);
        if (isMounted.current) {
          words.current = res.data.transcription;
          setInfo({
            id: res.data._id,
            duration: res.data.duration,
            url: res.data.original_video_url,
            finalUrl: res.data.final_video_url || null,
            canvas: res.data.canvas || null,
            title: res.data.title,
            finalText: res.data.final_full_text || null,
          });
        }
        console.log(res);
      } catch (err) {
        if (isMounted.current) setGetVideoError(err);
        console.log('Error Getting Video', err);
      } finally {
        if (isMounted.current) setIsGettingVideo(false);
        return;
      }
    },
    [axiosGetVideo]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return {
    isGettingVideo,
    getVideo,
    words: words.current,
    info,
    getVideoError,
  };
};

export default useGetVideo;
