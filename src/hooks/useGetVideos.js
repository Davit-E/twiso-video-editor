import { useCallback, useState } from 'react';
import axios from '../axios-instance';

const useGetVideos = () => {
  const [isDownloadingVideos, setIsDownloadingVideos] = useState(false);

  const axiosDownloadVideos = useCallback(() => {
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

  const downloadVideos = useCallback(async () => {
    setIsDownloadingVideos(true);
    try {
      const res = await axiosDownloadVideos();
      console.log(res);
    } catch (err) {
      console.log('Error Downloading Videos', err);
    } finally {
      setIsDownloadingVideos(false);
      return;
    }
  }, [axiosDownloadVideos]);

  return { isDownloadingVideos, downloadVideos };
};

export default useGetVideos;
