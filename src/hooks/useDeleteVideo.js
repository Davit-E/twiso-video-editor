import { useCallback, useState, useRef, useEffect } from 'react';
import axios from '../axios-instance';

const useDeleteVideo = () => {
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [deleteVideoResponse, setDeleteVideoResponse] = useState(null);
  const isMounted = useRef(false);

  const axiosDeleteVideo = useCallback((id) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/videos/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const deleteVideo = useCallback(
    async (id) => {
      setDeleteVideoResponse(null);
      setIsDeletingVideo(true);
      try {
        const res = await axiosDeleteVideo(id);
        if (isMounted.current) setDeleteVideoResponse('success');
        console.log(res);
      } catch (err) {
        if (isMounted.current) {
          setDeleteVideoResponse('error');
          setIsDeletingVideo(false);
        } 
        console.log('Error Deleting Video', err);
      } finally {
        return;
      }
    },
    [axiosDeleteVideo]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return {
    isDeletingVideo,
    deleteVideoResponse,
    deleteVideo,
  };
};

export default useDeleteVideo;
