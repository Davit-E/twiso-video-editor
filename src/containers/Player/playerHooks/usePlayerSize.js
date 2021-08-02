import { useEffect } from 'react';

const usePlayerSize = (
  isFirstLoad,
  videoSize,
  playerSize,
  dispatch,
  getPlayerSize,
  playerRef,
  setPlayerSize
) => {
  useEffect(() => {
    getPlayerSize(playerRef, setPlayerSize);
  }, [playerRef, setPlayerSize, getPlayerSize]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      getPlayerSize(playerRef, setPlayerSize)
    );
    return () => window.removeEventListener('resize', getPlayerSize);
  }, [getPlayerSize, playerRef, setPlayerSize]);

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
