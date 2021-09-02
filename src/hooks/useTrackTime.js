import { useEffect } from 'react';
const useTrackTime = (refreshToken) => {
  useEffect(() => {
    let interval = setInterval(() => {
      refreshToken();
    }, 1000 * 60 * 60 * 5); // 5 hours

    return () => clearInterval(interval);
  }, [refreshToken]);
};

export default useTrackTime;
