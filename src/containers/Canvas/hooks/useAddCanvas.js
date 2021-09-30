import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { loadAndUse } from '../utils/updateObject';

const addCanvas = (state, id, info, shouldLoad) => {
  let canvas = new fabric.Canvas(id, {
    width: state.initialWidth,
    height: state.initialHeight,
    backgroundColor: 'rgba(255,255,255,1)',
    preserveObjectStacking: true,
    fireRightClick: true,
    stopContextMenu: true,
    selection: false,
  });

  if (shouldLoad && info.canvas) {
    canvas.clear();
    canvas.loadFromJSON(info.canvas, () => {
      let objects = canvas.getObjects();
      let textObjects = objects.filter((obj) => {
        return obj.type === 'textbox';
      });
      for (let i = 0; i < textObjects.length; i++) {
        let text = textObjects[i];
        loadAndUse(canvas, text, text.fontFamily);
      }
    });
  }

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

const useAddCanvas = (
  state,
  setCanvas,
  setIsCanvasSet,
  id,
  info,
  setIsCanvasData,
  speakers
) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && state.initialWidth > 0) {
      let shouldLoad = speakers.length === 0 && info && info.canvas;
      if (shouldLoad) setIsCanvasData(true);
      let canvas = addCanvas(state, id, info, shouldLoad);
      setCanvas(canvas, info);
      setIsCanvasSet(true);
      setIsFirstLoad(false);
    }
  }, [
    speakers,
    setCanvas,
    setIsCanvasSet,
    state,
    isFirstLoad,
    id,
    info,
    setIsCanvasData,
  ]);
};

export default useAddCanvas;
