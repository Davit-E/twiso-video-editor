import { useEffect, useCallback } from 'react';

const useClickListener = (canvas) => {
  const clickHandler = useCallback(
    (e) => {
      if (canvas) {
        for (let i = 0; i < e.path.length; i++) {
          if (e.path[i].id === 'canvasComponent') return;
        }
        canvas.discardActiveObject();
      }
    },
    [canvas]
  );

  useEffect(() => {
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [canvas, clickHandler]);
};

export default useClickListener;
