import { useCallback, useState, useEffect, useRef } from 'react';
import axios from '../axios-instance';

const useUpdateTitle = () => {
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const isMounted = useRef(false);

  const axiosUpdateTitle = useCallback((data) => {
    return new Promise((resolve, reject) => {
      axios
        .put('/videos', data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const updateTitle = useCallback(
    async (data) => {
      setUploadResponse(null);
      setIsUpdatingTitle(true);
      try {
        const res = await axiosUpdateTitle(data);
        if (isMounted.current) setUploadResponse(res.data);
        console.log(res);
      } catch (uploadError) {
        console.log('Error Downloading Videos', uploadError);
        if (isMounted.current) setUploadResponse('error');
      } finally {
        if (isMounted.current) setIsUpdatingTitle(false);
        return;
      }
    },
    [axiosUpdateTitle]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isUpdatingTitle, updateTitle, uploadResponse };
};

export default useUpdateTitle;
