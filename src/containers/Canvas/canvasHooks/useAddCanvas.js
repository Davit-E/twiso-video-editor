import { useState, useEffect } from 'react';
import { fabric } from 'fabric';

const addCanvas = (state, id, size) => {
  let canvas = new fabric.Canvas(id, {
    width: size.width,
    height: size.height,
    backgroundColor: 'rgba(255,255,255,1)',
    preserveObjectStacking: true,
    bgImage: null,
  });
  return canvas;
};

const useAddCanvas = (state, setCanvas, setIsCanvasSet, size) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && size) {
      let canvas = addCanvas(state.canvasState, 'canvas', size);
      setCanvas(canvas);
      setIsCanvasSet(true);
      setIsFirstLoad(false);
    }
  }, [setCanvas, setIsCanvasSet, state.canvasState, isFirstLoad, size]);
};

export default useAddCanvas;
