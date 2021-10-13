import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [info, setInfo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const words = useRef(null);
  const isMounted = useRef(false);

  const onUploadProgress = (e) => {
    const currentProgress = Math.round((e.loaded * 100) / e.total);
    if (isMounted.current && currentProgress !== 100) {
      setUploadProgress(currentProgress);
    }
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
          setUploadProgress(100);
          words.current = res.data.subtitles.captions;
          setInfo({
            id: res.data._id,
            duration: res.data.duration,
            url: res.data.original_video_url,
            title: res.data.title,
          });
        }
      } catch (err) {
        console.log('Error Uploading Video', err);
      } finally {
        if (isMounted.current) setIsUploading(false);
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
    info,
    uploadProgress,
  };
};

export default useUploadVideo;
