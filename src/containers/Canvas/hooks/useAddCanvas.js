import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { loadAndUse } from '../utils/updateObject';

const addCanvas = (state, id, info, shouldLoad, setObjectIdCount) => {
  let canvas = new fabric.Canvas(id, {
    width: state.videoWidth,
    height: state.videoHeight,
    resize: state.resize,
    backgroundColor: 'rgba(255,255,255,1)',
    preserveObjectStacking: true,
    fireRightClick: true,
    stopContextMenu: true,
    selection: false,
  });

  if (shouldLoad && info.canvas) {
    canvas.clear();
    let lastId = 1;
    canvas.loadFromJSON(info.canvas, () => {
      let objects = canvas.getObjects();
      let textObjects = objects.filter((obj) => {
        obj.id = lastId;
        lastId++;
        return obj.type === 'textbox';
      });
      for (let i = 0; i < textObjects.length; i++) {
        let text = textObjects[i];
        loadAndUse(canvas, text, text.fontFamily);
      }
    });
    setObjectIdCount(lastId);
  }

  let ratio = Math.min(
    state.width / state.videoWidth,
    state.height / state.videoHeight
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
  speakers,
  setObjectIdCount
) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && state.width > 0) {
      let shouldLoad =
        speakers.length === 0 &&
        info &&
        info.canvas &&
        info.canvas.objects.length > 0;
      if (shouldLoad) setIsCanvasData(true);
      let canvas = addCanvas(state, id, info, shouldLoad, setObjectIdCount);
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
    setObjectIdCount,
  ]);
};

export default useAddCanvas;
