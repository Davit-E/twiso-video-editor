import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const addCanvas = (state, id) => {
  let canvas = new fabric.Canvas(id, {
    width: state.initialWidth,
    height: state.initialHeight,
    backgroundColor: 'rgba(255,255,255,1)',
    preserveObjectStacking: true,
    fireRightClick: true,
    stopContextMenu: true,
    selection: false,
  });

  let ratio = Math.min(
    state.width / state.initialWidth,
    state.height / state.initialHeight
  );
  canvas.setZoom(ratio);
  canvas.setDimensions({
    width: state.width,
    height: state.height,
  });
  return canvas;
};

const useAddCanvas = (state, setCanvas, setIsCanvasSet, id) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && state.initialWidth > 0) {
      let canvas = addCanvas(state, id);
      setCanvas(canvas);
      setIsCanvasSet(true);
      setIsFirstLoad(false);
    }
  }, [setCanvas, setIsCanvasSet, state, isFirstLoad, id]);
};

export default useAddCanvas;
