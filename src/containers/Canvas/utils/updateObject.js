import WebFont from 'webfontloader';
import { fabric } from 'fabric';

const loaded = ['Inter'];

const roundedCorners = (media, radius) => {
  let finalRad = 0;
  let width = media.width;
  let height = media.height;
  if (media.cropRect) {
    width = media.cropRect.w;
    height = media.cropRect.h;
  }
  width += media.strokeWidth;
  height += media.strokeWidth;
  if (width < height) finalRad = (width * radius) / 200;
  else finalRad = (height * radius) / 200;

  return new fabric.Rect({
    width: media.width + media.strokeWidth,
    height: media.height + media.strokeWidth,
    rx: finalRad,
    ry: finalRad,
    left: (-media.width - media.strokeWidth) / 2,
    top: (-media.height - media.strokeWidth) / 2,
    noScaleCache: false,
  });
};

export const updateVideoStyle = (state, canvas, dispatch) => {
  let video = state.currentObject.object;
  if (video && video.type === 'video') {
    let radius = state.videoState.cornerRadius;
    if (radius === 0) video.clipPath = null;
    else video.set('clipPath', roundedCorners(video, radius));
    for (const [key, value] of Object.entries(state.videoState)) {
      video.set(key, value);
    }
    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateVideo', data: false });
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
};

export const updateImageStyle = (state, canvas, dispatch) => {
  let image = state.currentObject.object;
  if (image && image.type === 'customImage') {
    let radius = state.imageState.cornerRadius;
    image.set('clipPath', roundedCorners(image, radius));
    image.cornerRadius = radius;
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateImage', data: false });
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
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
      if (dispatch)
        dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
    },
  });
};

export const updateTextStyle = (state, canvas, dispatch) => {
  let text = state.currentObject.object;
  let textState = state.textState;
  if (textState && text) {
    text._clearCache();
    for (const [key, value] of Object.entries(textState)) {
      if (key !== 'fontFamily') {
        text.set(key, value);
      }
    }
    if (!loaded.includes(textState.fontFamily)) {
      loadAndUse(canvas, text, textState.fontFamily, dispatch);
      loaded.push(textState.fontFamily);
    } else {
      text.set({
        fontFamily: textState.fontFamily,
      });
      canvas.requestRenderAll();
      dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
    }

    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
  }
  dispatch({ type: 'setShouldUpdateText', data: false });
};

export const updateSubtitlesStyle = (state, canvas, dispatch) => {
  let text = state.currentObject.object;
  if (text) {
    let textState = state.subtitlesState;
    text._clearCache();
    for (const [key, value] of Object.entries(textState)) {
      if (key !== 'fontFamily') {
        text.set(key, value);
      }
    }
    if (!loaded.includes(textState.fontFamily)) {
      loadAndUse(canvas, text, textState.fontFamily);
      loaded.push(textState.fontFamily);
    } else {
      text.set({
        fontFamily: textState.fontFamily,
      });
      canvas.requestRenderAll();
    }

    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
  }
  dispatch({ type: 'setShouldUpdateSubtitles', data: false });
};

export const updateShapeStyle = (state, canvas, dispatch) => {
  let shape = state.currentObject.object;
  if (shape) {
    // state.currentObject.object._clearCache();
    for (const [key, value] of Object.entries(state.shapeState)) {
      shape.set(key, value);
    }
    if (!state.showToolbar) dispatch({ type: 'setShowToolbar', data: true });
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateShape', data: false });
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
};
