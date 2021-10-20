const textPropertyArr = [
  'fontFamily',
  'fontStyle',
  'fontWeight',
  'fontSize',
  'fill',
  'opacity',
  'textAlign',
];
const shapePropertyArr = ['fill', 'stroke', 'strokeWidth', 'rx', 'ry'];
const imagePropertyArr = ['cornerRadius', 'isSvg'];
const videoPropertyArr = ['cornerRadius', 'stroke', 'strokeWidth'];

const handleObject = (e, dispatch, type, propertyArr) => {
  let newState = {};
  if (e.target.type === 'video' && e.target.stroke === null) {
    e.target.stroke = 'rgba(255,255,255,1)';
  }
  propertyArr.forEach((property) => {
    newState[property] = e.target[property];
  });
  dispatch({ type, data: newState });
};

const handleSelected = (e, dispatch) => {
  let obj = { type: '', object: null };
  dispatch({ type: 'setCurrentCoords', data: e.target.lineCoords });
  if (e.target.type === 'textbox') {
    obj.type = 'text';
    handleObject(e, dispatch, 'setTextState', textPropertyArr);
  } else if (e.target.type === 'customImage') {
    obj.type = 'customImage';
    handleObject(e, dispatch, 'setImageState', imagePropertyArr);
  } else if (e.target.type === 'subtitle') obj.type = 'subtitle';
  else if (e.target.type === 'video'){
    obj.type = 'video';
    handleObject(e, dispatch, 'setVideoState', videoPropertyArr);
  } else {
    obj.type = e.target.type
    handleObject(e, dispatch, 'setShapeState', shapePropertyArr);
  }
  obj.object = e.target;
  dispatch({ type: 'setCurrentObject', data: obj });
};

export const onCreated = (e, c, dispatch, showCanvasToolbar) => {
  if (e.target.type === 'activeSelection') {
    c.discardActiveObject();
    return;
  }
  if (showCanvasToolbar) {
    dispatch({ type: 'setShowCanvasToolbar', data: false });
  }
  handleSelected(e, dispatch);
};

export const onCleared = (e, dispatch, currentId) => {
  currentId.current = null;
  dispatch({
    type: 'setCurrentObject',
    data: { type: '', object: null },
  });
  dispatch({
    type: 'setCurrentCoords',
    data: null,
  });
};

export const onModified = (e, dispatch) => {
  handleSelected(e, dispatch);
  if (e.target.id !== 'subtitle') {
    dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
  }
};

export const onAdded = (e, dispatch) => {
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
};

export const onRemoved = (e, dispatch) => {
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
};

export const onUpdated = (e, dispatch) => {
  dispatch({ type: 'setShowToolbar', data: false });
  handleSelected(e, dispatch);
};

export const onTextEnter = (e, c, setIsEditingText) => {
  setIsEditingText(true);
  if (e.target.text === 'Add text‎') {
    e.target.text = '';
    e.target.hiddenTextarea.value = '';
    c.requestRenderAll();
  }
};

export const onTextExit = (e, c, setIsEditingText) => {
  setIsEditingText(false);
  if (e.target.text === '') e.target.text = 'Add text‎';
  c.requestRenderAll();
};
