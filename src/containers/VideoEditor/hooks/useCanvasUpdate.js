import { useEffect, useRef, useCallback } from 'react';

const getCanvasObject = (canvas) => {
  let jsonCanvas = canvas.toJSON([
    'id',
    'cornerRadius',
    'isSvg',
    'padding',
    'cursorWidth',
    'rx',
    'ry',
    'noScaleCache',
  ]);
  let zoom = canvas.getZoom();
  jsonCanvas.width = canvas.getWidth() / zoom;
  jsonCanvas.height = canvas.getHeight() / zoom;
  jsonCanvas.resize = canvas.resize;
  return jsonCanvas;
};

const useCanvasUpdate = (
  isMounted,
  updateProject,
  canvas,
  info,
  shouldTriggerUpdate,
  dispatch,
  isDownloading
) => {
  const timerRef = useRef(null);

  const triggerCanvasUpdate = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    let timeout = setTimeout(() => {
      if (isMounted.current) {
        timerRef.current = null;
        let jsonCanvas = getCanvasObject(canvas);
        updateProject({
          id: info.id,
          canvas: { ...jsonCanvas },
        });
      }
    }, 1000);
    timerRef.current = timeout;
  }, [updateProject, info, canvas, isMounted]);

  useEffect(() => {
    if (shouldTriggerUpdate && !isDownloading) {
      dispatch({ type: 'setShouldTriggerUpdate', data: false });
      triggerCanvasUpdate();
    }
  }, [triggerCanvasUpdate, shouldTriggerUpdate, dispatch, isDownloading]);
};

export default useCanvasUpdate;
