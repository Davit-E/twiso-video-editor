export const handlePaste = (
  canvas,
  clipboard,
  objId,
  updateId,
  setClipboard,
  dispatch,
  fabricSub
) => {
  let top = clipboard.coords.top + 15;
  let left = clipboard.coords.left + 15;
  let type = clipboard.object.type;
  clipboard.object.clone((cloned) => {
    cloned.id = objId;
    cloned.top = top;
    cloned.left = left;
    if (type === 'image') {
      cloned.isSvg = clipboard.object.isSvg;
      cloned.cornerRadius = clipboard.object.cornerRadius;
    } else if (type === 'textbox') {
      cloned.padding = 10;
      cloned.cursorWidth = 0.5;
    } else if (type === 'line') {
      cloned.borderColor = 'transparent';
      cloned.noScaleCache = false;
    } else {
      cloned.noScaleCache = false;
      cloned.strokeUniform = true;
    }
    canvas.add(cloned).setActiveObject(cloned);
    if (fabricSub) canvas.bringToFront(fabricSub);
    canvas.requestRenderAll();
    setClipboard({
      object: clipboard.object,
      coords: { top, left },
    });
    updateId();
    if (dispatch) dispatch({ type: 'setRightClickEvent', data: null });
  });
};
