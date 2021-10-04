import WebFont from 'webfontloader';
import { fabric } from 'fabric';

const loaded = ['Inter'];

const roundedCorners = (img, radius) => {
  let currentRadiusX = (img.width * img.scaleX * radius) / 200;
  let currentRadiusY = (img.height * img.scaleY * radius) / 200;
  let rect = new fabric.Rect({
    width: img.width,
    height: img.height,
    rx: currentRadiusX / img.scaleX,
    ry: currentRadiusY / img.scaleY,
    left: -img.width / 2,
    top: -img.height / 2,
    noScaleCache: false,
  });
  return rect;
};

export const updateImageStyle = (state, canvas, dispatch) => {
  let image = canvas.getActiveObject();
  if (image && image.type === 'customImage') {
    let radius = state.imageState.cornerRadius;
    image.set('clipPath', roundedCorners(image, radius));
    image.cornerRadius = radius;
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateImage', data: false });
  dispatch({ type: 'setShouldTriggerUpdate', data: true });
};

export const loadAndUse = (canvas, text, font, dispatch) => {
  WebFont.load({
    google: {
      families: [font],
    },
    timeout: 5000,
    fontactive: (familyName, fvd) => {
      text.set({ fontFamily: familyName });
      canvas.requestRenderAll();
      if (dispatch) dispatch({ type: 'setShouldTriggerUpdate', data: true });
    },
  });
};

export const updateTextStyle = (state, canvas, dispatch) => {
  if (state.textState) {
    state.currentObject.object._clearCache();
    for (const [key, value] of Object.entries(state.textState)) {
      if (key !== 'fontFamily') {
        state.currentObject.object.set(key, value);
      }
    }
    if (!loaded.includes(state.textState.fontFamily)) {
      loadAndUse(
        canvas,
        state.currentObject.object,
        state.textState.fontFamily,
        dispatch
      );
      loaded.push(state.textState.fontFamily);
    } else {
      state.currentObject.object.set({
        fontFamily: state.textState.fontFamily,
      });
      canvas.requestRenderAll();
      dispatch({ type: 'setShouldTriggerUpdate', data: true });
    }

    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
  }
  dispatch({ type: 'setShouldUpdateText', data: false });
};

export const updateSubtitlesStyle = (state, canvas, dispatch) => {
  if (state.subtitlesState) {
    let text = state.currentObject.object;
    text._clearCache();
    for (const [key, value] of Object.entries(state.subtitlesState)) {
      if (key !== 'fontFamily') {
        text.set(key, value);
      }
    }
    if (!loaded.includes(state.subtitlesState.fontFamily)) {
      loadAndUse(canvas, text, state.subtitlesState.fontFamily);
      loaded.push(state.subtitlesState.fontFamily);
    } else {
      text.set({
        fontFamily: state.subtitlesState.fontFamily,
      });
      canvas.requestRenderAll();
    }

    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
  }
  dispatch({ type: 'setShouldUpdateSubtitles', data: false });
};

export const updateShapeStyle = (state, canvas, dispatch) => {
  if (state.shapeState) {
    // state.currentObject.object._clearCache();
    for (const [key, value] of Object.entries(state.shapeState)) {
      state.currentObject.object.set(key, value);
    }
    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateShape', data: false });
  dispatch({ type: 'setShouldTriggerUpdate', data: true });
};
