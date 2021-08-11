import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const words = useRef(null);
  const isMounted = useRef(false);

  const onUploadProgress = (e) => {
    const currentProgress = Math.round((e.loaded * 100) / e.total);
    if (isMounted.current) setUploadProgress(currentProgress);
    if (currentProgress === 100 && isMounted.current) setIsUploading(false);
    // console.log(`%cuploading ${currentProgress}%`, 'color: #3153fb');
  };

  const axiosUploadVideo = useCallback((formData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/videos', formData, {
          onUploadProgress,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
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

  const uploadVideo = useCallback(
    async (formData) => {
      setUploadProgress(0);
      setIsUploading(true);
      try {
        const res = await axiosUploadVideo(formData);
        console.log(res);
        if (isMounted.current) {
          words.current = res.data.subtitles.captions;
          setDuration(res.data.duration);
          setVideoUrl(res.data.original_video_url);
        }
      } catch (err) {
        console.log('Error Uploading Video', err);
      } finally {
        return;
      }
    },
    [axiosUploadVideo]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return {
    isUploading,
    uploadVideo,
    words: words.current,
    duration,
    videoUrl,
    uploadProgress,
  };
};

export default useUploadVideo;
