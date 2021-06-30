import { useCallback, useState, useRef } from 'react';
import axios from '../axios-instance';

const useUploadVideo = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [fullText, setFullText] = useState(null);
  const words = useRef(null);

  const axiosUploadVideo = useCallback((formData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/upload', formData, {
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
      setIsUploading(true);
      try {
        const res = await axiosUploadVideo(formData);
        console.log(res.data);
        setDuration(res.data.duration);
        words.current = res.data.text_breakup;
        setFullText(res.data.full_text);
      } catch (err) {
        console.log('Error Uploading Video', err);
      } finally {
        setIsUploading(false);
        return;
      }
    },
    [axiosUploadVideo]
  );

  return { isUploading, uploadVideo, words: words.current, duration, fullText };
};

export default useUploadVideo;
