import { useCallback, useState } from 'react';
import axios from '../axios-instance';

const useDownloadVideo = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedVideo, setDownloadedVideo] = useState(false);

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
        .post('/videos/download', data, {
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
        setDownloadedVideo(res.data.url)
      } catch (err) {
        console.log('Error Downloading Video', err);
      } finally {
        setIsDownloading(false);
        return;
      }
    },
    [axiosDownloadVideo]
  );

  return { isDownloading, downloadVideo, downloadedVideo, setDownloadedVideo };
};

export default useDownloadVideo;
