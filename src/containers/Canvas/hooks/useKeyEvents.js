import { useEffect, useState } from 'react';
import { handlePaste } from '../utils/pasteObject';

const deleteHandler = (canvas) => {
  let active = canvas.getActiveObject();
  let isInput = document.activeElement.tagName === 'INPUT';
  if (
    !isInput &&
    active &&
    !active.isEditing &&
    active.type !== 'video' &&
    active.id !== 'subtitle'
  ) {
    canvas.remove(active);
    canvas.discardActiveObject().requestRenderAll();
  }
};

const keyDownHandler = (
  e,
  canvas,
  setIsPasting,
  setIsCopying,
  setIsBringToFront,
  setIsSendToBack
) => {
  if (canvas) {
    let ctrl = e.ctrlKey || e.metaKey;
    if (
      e.code === 'Delete' ||
      e.key === 'Delete' ||
      e.code === 'Backspace' ||
      e.key === 'Backspace'
    ) {
      deleteHandler(canvas);
    } else if (e.code === 'KeyC' || e.key === 'c') {
      if (ctrl) {
        e.preventDefault();
        setIsCopying(true);
      }
    } else if (e.code === 'KeyV' || e.key === 'v') {
      if (ctrl) {
        e.preventDefault();
        setIsPasting(true);
      }
    } else if (e.code === 'BracketRight' || e.key === ']') {
      if (ctrl) {
        e.preventDefault();
        setIsBringToFront(true);
      }
    } else if (e.code === 'BracketLeft' || e.key === '[') {
      if (ctrl) {
        e.preventDefault();
        setIsSendToBack(true);
      }
    }
  }
};

const keyUpHandler = (
  setIsPasting,
  setIsCopying,
  setIsBringToFront,
  setIsSendToBack,
  setShouldRun
) => {
  setIsCopying(false);
  setIsPasting(false);
  setIsBringToFront(false);
  setIsSendToBack(false);
  setShouldRun(true);
};

const useKeyEvents = (
  canvas,
  clipboard,
  setClipboard,
  objId,
  updateId,
  currentSub
) => {
  const [isPasting, setIsPasting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isBringToFront, setIsBringToFront] = useState(false);
  const [isSendToBack, setIsSendToBack] = useState(false);
  const [shouldRun, setShouldRun] = useState(true);
  useEffect(() => {
    if (shouldRun && isPasting && clipboard) {
      setShouldRun(false);
      handlePaste(
        canvas,
        clipboard,
        objId,
        updateId,
        setClipboard,
        null,
        currentSub
      );
    } else if (shouldRun && isCopying) {
      setShouldRun(false);
      let active = canvas.getActiveObject();
      if (active && active.type !== 'video' && active.id !== 'subtitle') {
        setClipboard({
          object: active,
          coords: { top: active.top, left: active.left },
        });
      }
    } else if (shouldRun && isBringToFront) {
      setShouldRun(false);
      let active = canvas.getActiveObject();
      if (active && active.id !== 'subtitle') {
        canvas.bringToFront(active);
        if (currentSub) canvas.bringToFront(currentSub);
      }
    } else if (shouldRun && isSendToBack) {
      setShouldRun(false);
      let active = canvas.getActiveObject();
      if (active && active.id !== 'subtitle') canvas.sendToBack(active);
    }
  }, [
    canvas,
    isPasting,
    isCopying,
    isBringToFront,
    isSendToBack,
    objId,
    setClipboard,
    clipboard,
    updateId,
    shouldRun,
    currentSub,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', (e) =>
      keyDownHandler(
        e,
        canvas,
        setIsPasting,
        setIsCopying,
        setIsBringToFront,
        setIsSendToBack
      )
    );
    document.addEventListener('keyup', (e) => {
      keyUpHandler(
        setIsPasting,
        setIsCopying,
        setIsBringToFront,
        setIsSendToBack,
        setShouldRun
      );
    });

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [canvas]);
};

export default useKeyEvents;
