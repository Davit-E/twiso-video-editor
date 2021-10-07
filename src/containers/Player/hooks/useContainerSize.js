import { useEffect, useCallback } from 'react';
import { getContainerSize } from '../utils/getSize';

const getCanvasSize = (videoWidth, videHeight, containerWidth) => {
  let maxWidth = 800;
  let maxHeight = 560;
  let width = containerWidth;
  let height = (videHeight * width) / videoWidth;
  if (width > height) {
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
  }
  return { width, height };
};

const useContainerSize = (state, dispatch, containerRef) => {
  const containerPadding = 88;
  const getSizeInfo = useCallback(() => {
    let { width, height } = getCanvasSize(
      state.videoWidth,
      state.videoHeight,
      state.containerWidth
    );
    if (width > height) containerRef.current.style.marginTop = '5rem';
    else containerRef.current.style.marginTop = '1rem';
    let isInRange = width > 100;
    return isInRange ? { width, height } : {};
  }, [containerRef, state]);

  const handleResize = useCallback(() => {
    let { containerWidth, containerHeight } = getContainerSize(
      containerRef,
      containerPadding
    );
    dispatch({
      type: 'setContainerSize',
      data: { width: containerWidth, height: containerHeight },
    });
  }, [dispatch, containerRef]);

  useEffect(() => {
    if (state.initialWidth > 0 && state.shouldСalculateCanvasSize) {
      dispatch({ type: 'setShouldСalculateCanvasSize', data: false });
      let { width, height } = getSizeInfo();
      // console.log(width, height);
      if (width) {
        dispatch({
          type: 'setCanvasSize',
          data: { width, height },
        });
      }
    }
  }, [dispatch, getSizeInfo, state]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
};

export default useContainerSize;
