import { fabric } from 'fabric';

export const addNewImage = (state, canvas, dispatch, id, updateId) => {
  let image = state.imageToAdd.src;
  if (state.shouldReplaceImage) {
    let active = canvas.getActiveObject();
    fabric.Image.fromURL(
      image,
      (img) => {
        img.top = active.top;
        img.left = active.left;
        img.scaleToWidth(active.width * active.scaleX);
        img.angle = active.angle;
        img.id = active.id;
        img.cornerRadius = active.cornerRadius;
        img.isSvg = state.imageToAdd.type === 'svg';
        canvas.remove(active);
        canvas.add(img).setActiveObject(img);
        canvas.requestRenderAll();
        dispatch({ type: 'setShouldUpdateImage', data: true });
        dispatch({ type: 'setShouldReplaceImage', data: false });
      },
      { crossOrigin: 'Anonymous' }
    );
  } else {
    fabric.Image.fromURL(
      image,
      (img) => {
        img.scaleToWidth(256);
        img.left = 100;
        img.top = 100;
        img.id = id;
        img.cornerRadius = 0;
        img.isSvg = state.imageToAdd.type === 'svg';
        canvas.add(img).setActiveObject(img);
        canvas.requestRenderAll();
        updateId();
      },
      { crossOrigin: 'Anonymous' }
    );
  }
  dispatch({ type: 'setImageToAdd', data: null });
};

export const addNewImage2 = (state, canvas, dispatch, id, updateId) => {
  let image = state.imageToAdd.src;
  if (state.shouldReplaceImage) {
    let active = canvas.getActiveObject();
    fabric.ImageWithCrop.fromURL(
      image,
      (img) => {
        img.top = active.top;
        img.left = active.left;
        img.scaleToWidth(active.width * active.scaleX);
        img.angle = active.angle;
        img.id = active.id;
        img.cornerRadius = active.cornerRadius;
        img.isSvg = state.imageToAdd.type === 'svg';
        canvas.remove(active);
        canvas.add(img).setActiveObject(img);
        canvas.requestRenderAll();
        dispatch({ type: 'setShouldUpdateImage', data: true });
        dispatch({ type: 'setShouldReplaceImage', data: false });
      },
      { crossOrigin: 'Anonymous' }
    );
  } else {
    fabric.ImageWithCrop.fromURL(
      image,
      (img) => {
        img.left = 0;
        img.top = 0;
        img.id = id;
        img.cornerRadius = 0;
        img.isSvg = state.imageToAdd.type === 'svg';
        canvas.add(img).setActiveObject(img);
        canvas.requestRenderAll();
        updateId();
      },
      { crossOrigin: 'Anonymous' }
    );
  }
  dispatch({ type: 'setImageToAdd', data: null });
};

export const addNewText = (canvas, state, dispatch, id, updateId) => {
  dispatch({ type: 'setShouldAddText', data: false });
  let text = new fabric.Textbox('Add text‎', {
    left: 100,
    top: 100,
    height: 100,
    padding: 10,
    width: 130,
    splitByGrapheme: true,
    cursorWidth: 0.5,
    ...state.textState,
  });
  text.id = id;
  canvas.add(text).setActiveObject(text);
  canvas.requestRenderAll();
  updateId();
};

const newRect = () => {
  let rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 152,
    height: 152,
    noScaleCache: false,
    strokeUniform: true,
    fill: 'rgba(196,196,196,1)',
    stroke: 'rgba(255,255,255,1)',
    strokeWidth: 0,
    rx: 0,
    ry: 0,
  });
  return rect;
};

const newCircle = () => {
  let circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 76,
    noScaleCache: false,
    strokeUniform: true,
    fill: 'rgba(196,196,196,1)',
    stroke: 'rgba(255,255,255,1)',
    strokeWidth: 0,
    rx: 0,
    ry: 0,
  });
  return circle;
};

const newTriangle = () => {
  let triangle = new fabric.Triangle({
    left: 100,
    top: 100,
    width: 152,
    height: 150,
    noScaleCache: false,
    strokeUniform: true,
    fill: 'rgba(196,196,196,1)',
    stroke: 'rgba(255,255,255,1)',
    strokeWidth: 0,
    rx: 0,
    ry: 0,
  });
  return triangle;
};

const newLine = () => {
  let line = new fabric.Line([0, 0, 300, 0], {
    left: 100,
    top: 100,
    stroke: 'rgba(196,196,196,1)',
    strokeWidth: 2,
    noScaleCache: false,
    rx: 0,
    ry: 0,
  });
  return line;
};

export const addNewShape = (state, canvas, dispatch, id, updateId) => {
  dispatch({ type: 'setShapeToAdd', data: null });
  let obj = null;
  if (state.shapeToAdd === 'square') obj = newRect();
  else if (state.shapeToAdd === 'circle') obj = newCircle();
  else if (state.shapeToAdd === 'triangle') obj = newTriangle();
  else if (state.shapeToAdd === 'line') obj = newLine();
  if (obj) {
    obj.id = id;
    canvas.add(obj).setActiveObject(obj);
    canvas.requestRenderAll();
    updateId();
  }
};
