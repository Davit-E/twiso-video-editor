import { useEffect, useCallback } from 'react';

const useClickListener = (canvas, state) => {
  const clickHandler = useCallback(
    (e) => {
      if (
        canvas &&
        !state.isCropMode &&
        !state.shouldCropMedia &&
        !state.shouldReplaceImage
      ) {
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i].id === 'canvasComponent') return;
        }
        canvas.discardActiveObject().requestRenderAll();
      }
    },
    [canvas, state.isCropMode, state.shouldCropMedia, state.shouldReplaceImage]
  );

  useEffect(() => {
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [canvas, clickHandler]);
};

export default useClickListener;
