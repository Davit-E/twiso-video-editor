import { useEffect, useCallback, useState } from 'react';
import { getContainerSize } from '../utils/getSize';

const useContainerSize = (videoSize, dispatch, containerRef) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [containerSize, setContainerSize] = useState(null);
  const containerPadding = 200;

  const handleSize = useCallback(() => {
    getContainerSize(containerRef, setContainerSize, containerPadding);
  }, [containerRef, setContainerSize, containerPadding]);

  useEffect(() => {
    handleSize();
  }, [handleSize]);

  useEffect(() => {
    window.addEventListener('resize', handleSize);
    return () => window.removeEventListener('resize', handleSize);
  }, [handleSize]);

  useEffect(() => {
    if (videoSize && containerSize) {
      let width = containerSize.width;
      let height = (videoSize.height * width) / videoSize.width;
      let isInRange = width > 100;
      if (isFirstLoad && isInRange) {
        setIsFirstLoad(false);
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
  }, [isFirstLoad, containerSize, videoSize, dispatch]);
};

export default useContainerSize;
