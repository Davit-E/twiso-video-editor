import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { loadAndUse } from '../utils/updateObject';
import { setSize } from '../utils/updateCanvas';

const addCanvas = (
  state,
  id,
  info,
  shouldLoad,
  setObjectIdCount,
  setCanvas,
  setIsCanvasSet
) => {
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

  if (info.canvas) {
    canvas.clear();
    let lastId = 1;
    canvas.loadFromJSON(info.canvas, () => {
      let objects = canvas.getObjects();
      let textArr = [];
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if (!shouldLoad && obj.type === 'video') canvas.remove(obj);
        else {
          obj.id = lastId;
          lastId++;
          if (obj.type === 'textbox') textArr.push(obj);
        }
      }
      for (let i = 0; i < textArr.length; i++) {
        let text = textArr[i];
        loadAndUse(canvas, text, text.fontFamily);
      }
      setSize(state, canvas);
      setObjectIdCount(lastId);
      setCanvas(canvas)
      setIsCanvasSet(true)
    });
  } else {
    setSize(state, canvas);
    setCanvas(canvas)
    setIsCanvasSet(true)
  } 
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
      let isCanvas = info && info.canvas && info.canvas.objects.length > 0;
      let shouldLoad = speakers.length === 0 && isCanvas;
      if (shouldLoad) setIsCanvasData(true);
      addCanvas(
        state,
        id,
        info,
        shouldLoad,
        setObjectIdCount,
        setCanvas,
        setIsCanvasSet
      );
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
