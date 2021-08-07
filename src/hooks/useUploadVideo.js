import { useCallback, useState, useRef } from 'react';
import axios from '../axios-instance';

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const words = useRef(null);

  const onUploadProgress = (e) => {
    const currentProgress = Math.round((e.loaded * 100) / e.total);
    setProgress(currentProgress);
    console.log(`%cuploading ${currentProgress}%`, 'color: #3153fb');
  };

  // const onDownloadProgress = (e) => {
  //   // const currentProgress = Math.round((e.loaded * 100) / e.total);
  //   console.log('%cdownloaded', 'color: #0cc700');
  // };

  const axiosUploadVideo = useCallback((formData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/videos', formData, {
          onUploadProgress,
          // onDownloadProgress,
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
      setProgress(0);
      setIsUploading(true);
      try {
        const res = await axiosUploadVideo(formData);
        console.log(res);
        console.log(res.data);
        setDuration(res.data.duration);
        words.current = res.data.subtitles.captions;
        setVideoUrl(res.data.original_video_url);
      } catch (err) {
        console.log('Error Uploading Video', err);
      } finally {
        setIsUploading(false);
        setProgress(100);
        return;
      }
    },
    [axiosUploadVideo]
  );

  return {
    isUploading,
    uploadVideo,
    words: words.current,
    duration,
    videoUrl,
    progress,
  };
};

export default useUploadVideo;
