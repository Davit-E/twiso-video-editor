export const updateCanvasStyle = (state, canvas, dispatch) => {
  canvas.backgroundColor = state.backgroundColor;
  canvas.requestRenderAll();
  dispatch({ type: 'setShouldUpdateCanvas', data: false });
};

export const updateCanvasSize = (state, canvas, dispatch) => {
  canvas.discardActiveObject();
  let ratio = Math.min(
    state.width / state.initialWidth,
    state.height / state.initialHeight
  );
  canvas.setZoom(ratio);
  canvas.setDimensions({
    width: state.width,
    height: state.height,
  });
  canvas.requestRenderAll();
  dispatch({ type: 'setShouldUpdateCanvasSize', data: false });
};
