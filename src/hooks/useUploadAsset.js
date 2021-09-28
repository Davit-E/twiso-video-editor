import { useCallback, useState, useEffect, useRef } from 'react';
import axios from '../axios-instance';

const useUploadAsset = () => {
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const isMounted = useRef(false);

  const axiosUploadAsset = useCallback((formData) => {
    return new Promise((resolve, reject) => {
      axios
        .post('/images', formData)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }, []);

  const uploadAsset = useCallback(
    async (formData) => {
      setUploadResponse(null);
      setIsUploadingAsset(true);
      try {
        const res = await axiosUploadAsset(formData);
        if (isMounted.current) setUploadResponse(res.data);
        console.log(res);
      } catch (uploadError) {
        console.log('Error Uploading Asset', uploadError);
        if (isMounted.current) setUploadResponse('error');
      } finally {
        if (isMounted.current) setIsUploadingAsset(false);
        return;
      }
    },
    [axiosUploadAsset]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isUploadingAsset, uploadAsset, uploadResponse };
};

export default useUploadAsset;
