import { useEffect, useCallback } from 'react';

const usePlayerSize = (
  isFirstLoad,
  videoSize,
  playerSize,
  dispatch,
  getPlayerSize,
  playerRef,
  setPlayerSize
) => {
  
  const handleSize = useCallback(() => {
    getPlayerSize(playerRef, setPlayerSize);
  }, [getPlayerSize, playerRef, setPlayerSize]);

  useEffect(() => {
    handleSize();
  }, [handleSize]);

  useEffect(() => {
    window.addEventListener('resize', handleSize);
    return () => window.removeEventListener('resize', handleSize);
  }, [handleSize]);

  useEffect(() => {
    if (videoSize && playerSize) {
      // console.log('video: ', videoSize);
      // console.log('player: ', playerSize);
      let width = playerSize.width;
      let height = (videoSize.height * width) / videoSize.width;
      // console.log(width, height);
      let isInRange = width > 100;
      if (isFirstLoad.current && isInRange) {
        isFirstLoad.current = false;
        dispatch({
          type: 'setCanvasInitialSize',
          data: {
            initialWidth: videoSize.width,
            initialHeight: videoSize.height,
            width,
            height,
          },
        });
      } else if (isInRange) {
        dispatch({ type: 'setCanvasSize', data: { width, height } });
      }
    }
  }, [isFirstLoad, playerSize, videoSize, dispatch]);
};

export default usePlayerSize;
