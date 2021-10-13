import { useEffect, useRef, useCallback } from 'react';

const useCheckTranscription = (
  isGettingVideo,
  getVideo,
  status,
  isMounted,
  params
) => {
  const intervalRef = useRef(null);

  const checkTranscription = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let interval = setInterval(() => {
      if (isMounted.current && !isGettingVideo) {
        getVideo(params.id);
      }
    }, 4000);
    intervalRef.current = interval;
  }, [getVideo, params, isMounted, isGettingVideo]);

  useEffect(() => {
    if (status && !status.isFinished) {
      checkTranscription();
    } else if (status && status.isFinished) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [status, checkTranscription]);
};

export default useCheckTranscription;
