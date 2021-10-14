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

const roundedCornersVideo = (video, radius) => {
  let currentRadiusX = (video.width * video.scaleX * radius) / 200;
  let currentRadiusY = (video.height * video.scaleY * radius) / 200;
  let rect = new fabric.Rect({
    width: video.width,
    height: video.height,
    scaleX: video.scaleX,
    scaleY: video.scaleY,
    rx: currentRadiusX / video.scaleX,
    ry: currentRadiusY / video.scaleY,
    left: video.left,
    top: video.top,
    noScaleCache: false,
    fill: 'rgba(70, 70, 70, 0.0)',
  });
  return rect;
};

export const updateVideoStyle = (state, canvas, dispatch) => {
  let video = canvas.getActiveObject();
  if (video && video.type === 'video') {
    console.log('updating');
    let radius = state.videoState.cornerRadius;
    video.cornerRadius = radius;
    let rect = roundedCornersVideo(video, radius);
    // var group = new fabric.Group([video, rect], {
    //   left: video.left,
    //   top: video.top,
    //   width: video.width,
    //   height: video.height,
    //   scaleX: video.scaleX,
    //   scaleY: video.scaleY,
    //   originX: 'center',
    //   originY: 'center',
    // });
    // canvas.add(group);
    canvas.requestRenderAll();
  }
  dispatch({ type: 'setShouldUpdateVideo', data: false });
  dispatch({ type: 'setShouldTriggerCanvasUpdate', data: true });
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
