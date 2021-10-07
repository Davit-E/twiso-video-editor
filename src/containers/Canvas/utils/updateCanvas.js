export const updateCanvasStyle = (state, canvas, dispatch) => {
  canvas.backgroundColor = state.backgroundColor;
  canvas.requestRenderAll();
  dispatch({ type: 'setShouldUpdateCanvas', data: false });
  dispatch({ type: 'setShouldTriggerUpdate', data: true });
};

const checkOffScreen = (object, canvas) => {
  let zoom = canvas.getZoom();
  let width = canvas.getWidth() / zoom;
  let height = canvas.getHeight() / zoom;
  if (!object.isOnScreen()) {
    if (object.top > height) {
      object.top = height - object.height * object.scaleY;
    }
    if (object.left > width) {
      object.left = width - object.width * object.scaleX;;
    }
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
    canvas.resize = state.resize;
    canvas.setZoom(ratio);
    canvas.setDimensions({
      width: state.width,
      height: state.height,
    });
    canvas.renderAll();
    let objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];
      checkOffScreen(object, canvas);
    }
    canvas.requestRenderAll();
    dispatch({ type: 'setShouldTriggerUpdate', data: true });
  }
};
