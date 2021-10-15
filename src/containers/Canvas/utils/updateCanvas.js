export const updateCanvasStyle = (state, canvas, dispatch) => {
  canvas.backgroundColor = state.backgroundColor;
  canvas.requestRenderAll();
  dispatch({ type: 'setShouldUpdateCanvas', data: false });
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
};

export const setSize = (state, canvas) => {
  let ratio = Math.min(
    state.width / state.videoWidth,
    state.height / state.videoHeight
  );
  canvas.setZoom(ratio);
  canvas.setDimensions({
    width: state.width,
    height: state.height,
  });
  canvas.renderAll();
};

export const checkOffScreen = (object, canvas, resize, dispatch) => {
  let zoom = canvas.getZoom();
  let canvasWidth = canvas.getWidth() / zoom;
  let canvasHeight = canvas.getHeight() / zoom;
  let objHeight = object.height * object.scaleY;
  let objWidth = object.width * object.scaleX;
  let isSub = object.type === 'subtitle';
  let isTextObject = object.type === 'textbox' || isSub;
  let isVertical = resize === 'vertical';
  let shouldResize =
    isVertical &&
    (objWidth > (canvasWidth * 2) / 3 || objHeight > (canvasHeight * 2) / 3);

  if (shouldResize && isTextObject) {
    object.width = canvasWidth / 2;
    objWidth = canvasWidth / 2;
  } else if (shouldResize) {
    let desiredSize = (canvasWidth * 2) / 3;
    let scale = desiredSize / object.width;
    object.scaleX = scale;
    object.scaleY = scale;
    objWidth = object.width * object.scaleX;
    objHeight = object.height * object.scaleY;
  }

  if (isTextObject && isVertical && +object.fontSize > 30 && dispatch) {
    object.fontSize = 30;
    dispatch({
      type: isSub ? 'setSubtitlesFontSize' : 'setFontSize',
      data: 30,
    });
  }
  if (!object.isOnScreen() && !isSub) {
    if (object.top > canvasHeight || object.top < 0) {
      object.top = canvasHeight - objHeight;
    }
    if (object.left > canvasWidth || object.left < 0) {
      object.left = canvasWidth - objWidth;
    }
  } else if (isSub) {
    object.left = canvasWidth / 2;
    let top = canvasHeight - object.height - object.paddingY;
    object.top = top > 0 ? top : object.height / 2;
    object.width = 550 < canvasWidth / 2 ? 550 : canvasWidth / 2;
  }
  object.setCoords();
};

export const updateCanvasSize = (state, canvas, dispatch) => {
  dispatch({ type: 'setShouldUpdateCanvasSize', data: false });
  if (canvas) {
    canvas.discardActiveObject();
    let isResize = canvas.resize !== state.resize;
    canvas.resize = state.resize;
    setSize(state, canvas);
    if (isResize) {
      let objects = canvas.getObjects();
      for (let i = 0; i < objects.length; i++) {
        let object = objects[i];
        checkOffScreen(object, canvas, state.resize, dispatch);
      }
      dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
    }
    canvas.renderAll();
  }
};
