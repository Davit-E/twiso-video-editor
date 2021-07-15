import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const addCanvas = (state, id) => {
  let canvas = new fabric.Canvas(id, {
    width: state.initialWidth,
    height: state.initialHeight,
    backgroundColor: 'rgba(255,255,255,1)',
    preserveObjectStacking: true,
    bgImage: null,
    fireRightClick: true,  
    stopContextMenu: true,  
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

const useAddCanvas = (state, setCanvas, setIsCanvasSet) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && state.canvasState.initialWidth > 0) {
      let canvas = addCanvas(state.canvasState, 'canvas');
      setCanvas(canvas);
      setIsCanvasSet(true);
      setIsFirstLoad(false);
    }
  }, [setCanvas, setIsCanvasSet, state.canvasState, isFirstLoad]);
};

export default useAddCanvas;
