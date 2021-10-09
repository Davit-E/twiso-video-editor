export const updateCanvasStyle = (state, canvas, dispatch) => {
  canvas.backgroundColor = state.backgroundColor;
  canvas.requestRenderAll();
  dispatch({ type: 'setShouldUpdateCanvas', data: false });
  dispatch({ type: 'setShouldTriggerUpdate', data: true });
};

const checkOffScreen = (object, canvas, resize, dispatch) => {
  let zoom = canvas.getZoom();
  let canvasWidth = canvas.getWidth() / zoom;
  let canvasHeight = canvas.getHeight() / zoom;
  // console.log(canvasWidth, canvasHeight, resize);
  let objHeight = object.height * object.scaleY;
  let objWidth = object.width * object.scaleX;

  let isTextObject = object.type === 'textbox' || object.type === 'subtitle';
  let shouldResize =
    resize === 'vertical' &&
    (objWidth > canvasWidth || objHeight > canvasHeight);

  if (shouldResize && isTextObject) {
    object.width = canvasWidth / 2;
    objWidth = canvasWidth / 2;
  } else if (shouldResize) {
    // if (objWidth / 2 > canvasWidth || objHeight / 2 > canvasHeight) {
    //   object.scaleX = canvasWidth;

    // } else {
     
    // }
    object.scaleX = object.scaleX / 2;
    object.scaleY = object.scaleY / 2;
    objWidth = object.width * object.scaleX;
    objHeight = object.height * object.scaleY;
  }

  // if (isTextObject && resize === 'vertical' && +object.fontSize > 36) {
  //   let isSub = object.type === 'subtitle';
  //   let obj = { type: isSub ? 'subtitle' : 'textbox', object };
  //   dispatch({ type: 'setCurrentObject', data: obj });
  //   dispatch({
  //     type: isSub ? 'setSubtitlesFontSize' : 'setFontSize',
  //     data: 36,
  //   });
  // }

  if (!object.isOnScreen()) {
    // console.log(object);
    if (object.top > canvasHeight) object.top = canvasHeight - objHeight;
    if (object.left > canvasWidth) object.left = canvasWidth - objWidth;
    object.setCoords();
  }
};

export const updateCanvasSize = (state, canvas, dispatch) => {
  dispatch({ type: 'setShouldUpdateCanvasSize', data: false });
  if (canvas) {
    canvas.discardActiveObject();
    let ratio = Math.min(
      state.width / state.videoWidth,
      state.height / state.videoHeight
    );
    let isResize = canvas.resize !== state.resize;
    canvas.resize = state.resize;
    canvas.setZoom(ratio);
    canvas.setDimensions({
      width: state.width,
      height: state.height,
    });
    if (isResize) {
      canvas.renderAll();
      let objects = canvas.getObjects();
      for (let i = 0; i < objects.length; i++) {
        let object = objects[i];
        checkOffScreen(object, canvas, state.resize, dispatch);
      }
    }
    canvas.renderAll();
    dispatch({ type: 'setShouldTriggerUpdate', data: true });
  }
};
