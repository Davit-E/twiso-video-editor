import { useCallback, useState, useEffect, useRef } from 'react';
import axios from '../axios-instance';

const useUpdateProject = () => {
  const [isUpdatingProject, setIsUpdatingProject] = useState(false);
  const [updateResponse, setUpdateResponse] = useState(null);
  const isMounted = useRef(false);

  const axiosUpdateProject = useCallback((data) => {
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

  const updateProject = useCallback(
    async (data) => {
      setUpdateResponse(null);
      setIsUpdatingProject(true);
      try {
        const res = await axiosUpdateProject(data);
        if (isMounted.current) setUpdateResponse(res.data);
        console.log(res);
      } catch (uploadError) {
        console.log('Error Updating Project', uploadError);
        if (isMounted.current) setUpdateResponse('error');
      } finally {
        if (isMounted.current) setIsUpdatingProject(false);
        return;
      }
    },
    [axiosUpdateProject]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return { isUpdatingProject, updateProject, updateResponse };
};

export default useUpdateProject;
