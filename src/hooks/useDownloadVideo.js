import { useCallback, useState } from 'react';
import axios from '../axios-instance';

const useDownloadVideo = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedVideo, setDownloadedVideo] = useState(false);

  const axiosDownloadVideo = useCallback((data) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/download', data)
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
        console.log(res.data);
      } catch (err) {
        console.log('Error Downloading Video', err);
      } finally {
        setIsDownloading(false);
        return;
      }
    },
    [axiosDownloadVideo]
  );

  return { isDownloading, downloadVideo, downloadedVideo };
};

export default useDownloadVideo;
