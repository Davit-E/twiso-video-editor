import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useDownloadVideo = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedVideo, setDownloadedVideo] = useState(false);
  const isMounted = useRef(false);

  const onUploadProgress = (e) => {
    const currentProgress = Math.round((e.loaded * 100) / e.total);
    console.log(`%cuploading ${currentProgress}%`, 'color: #3153fb');
  };

  const onDownloadProgress = (e) => {
    const currentProgress = Math.round((e.loaded * 100) / e.total);
    console.log(`%cdownloading ${currentProgress}%`, 'color: #0cc700');
  };

  const axiosDownloadVideo = useCallback((data) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/download-video', data, {
          onUploadProgress,
          onDownloadProgress,
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

  const downloadVideo = useCallback(
    async (data) => {
      setIsDownloading(true);
      try {
        const res = await axiosDownloadVideo(data);
        console.log(res);
        if (isMounted.current) setDownloadedVideo(res.data.url);
      } catch (err) {
        console.log('Error Downloading Video', err);
      } finally {
        if (isMounted.current) setIsDownloading(false);
        return;
      }
    },
    [axiosDownloadVideo]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isDownloading, downloadVideo, downloadedVideo, setDownloadedVideo };
};

export default useDownloadVideo;
