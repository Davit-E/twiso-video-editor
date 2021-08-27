import { fabric } from 'fabric';

export const restrictBox = (active, box) => {
  box.on('moving', (e) => {
    let objectHeight = box.height * box.scaleY;
    let objectWidth = box.width * box.scaleX;
    let boundHeight = active.height * active.scaleY;
    let boundWidth = active.width * active.scaleX;
    let top = box.top;
    let left = box.left;
    let bottom = box.top + objectHeight;
    let right = box.left + objectWidth;
    let topBound = active.top;
    let bottomBound = topBound + boundHeight;
    let leftBound = active.left;
    let rightBound = leftBound + boundWidth;
    //left
    if (left < leftBound) box.left = leftBound;
    //top
    if (top < topBound) box.top = topBound;
    //right
    if (right > rightBound) box.left = rightBound - objectWidth;
    //bottom
    if (bottom > bottomBound) box.top = bottomBound - objectHeight;
  });

  box.on('scaling', (e) => {
    let objectHeight = box.height * box.scaleY;
    let objectWidth = box.width * box.scaleX;
    let boundHeight = active.height * active.scaleY;
    let boundWidth = active.width * active.scaleX;
    let top = box.top;
    let bottom = top + objectHeight;
    let left = box.left;
    let right = left + objectWidth;
    let topBound = active.top;
    let bottomBound = topBound + boundHeight;
    let leftBound = active.left;
    let rightBound = leftBound + boundWidth;
    box.left = Math.min(Math.max(left, leftBound), rightBound - objectWidth);
    box.top = Math.min(Math.max(top, topBound), bottomBound - objectHeight);
    if (box.scaleX > active.scaleX) {
      box.scaleX = active.scaleX;
      if (left < leftBound || right > rightBound) box.left = leftBound;
    }
    if (box.scaleY > active.scaleY) {
      box.scaleY = active.scaleY;
      if (top < topBound || bottom > bottomBound) box.top = topBound;
    }
  });
};

export const getSpeakerBox = (boxSize, boxId, updateBoxId) => {
  let box = new fabric.Rect({
    ...boxSize,
    fill: 'rgba(111, 122, 208, 0.4)',
    top: 0,
    left: 0,
    borderColor: '#6F7BD0',
    lockScalingFlip: true,
    id: boxId,
  });
  updateBoxId();
  return box;
};


export const addSpeaker = (boxArr, boxId, canvas, setBoxArr, updateBoxId, video) => {
  let size = null;
  if (boxArr.length === 0) {
    size = {
      width: video.width,
      height: video.height,
      scaleX: video.scaleX / 2,
      scaleY: video.scaleY / 2,
    };
  } else {
    let last = boxArr[boxArr.length - 1];
    size = {
      width: last.width,
      height: last.height,
      scaleX: last.scaleX,
      scaleY: last.scaleY,
    };
  }
  let box = getSpeakerBox(size, boxId, updateBoxId);
  canvas.add(box).setActiveObject(box);
  canvas.requestRenderAll();
  setBoxArr((prevState) => [...prevState, box]);
  restrictBox(video, box);
};

const getImageCropBox = (topBound, leftBound, activeEl) => {
  let box = new fabric.Rect({
    fill: 'rgba(0,0,0,0)',
    originX: 'left',
    originY: 'top',
    left: leftBound,
    top: topBound,
    borderDashArray: [2, 2],
    borderColor: '#dbff17',
    width: activeEl.width,
    height: activeEl.height,
    scaleX: activeEl.scaleX,
    scaleY: activeEl.scaleY,
    selectable: true,
    lockScalingFlip: true,
    type: 'cropbox',
  });
  box.controls.mtr.visible = false;
  return box;
};

export const prepareForImageCrop = (
  active,
  dispatch,
  canvas,
  setAcitveEl,
  setCropbox
) => {
  canvas.getObjects().forEach((el) => (el.selectable = false));
  let transformMatrix = active.calcTransformMatrix();
  let cx = transformMatrix[4];
  let cy = transformMatrix[5];
  let angle = ((360 - active.angle) * Math.PI) / 180;

  let leftBound =
    cx -
    Math.abs(
      (active.left - cx) * Math.cos(angle) - (active.top - cy) * Math.sin(angle)
    );
  let topBound =
    cy -
    Math.abs(
      (active.left - cx) * Math.sin(angle) + (active.top - cy) * Math.cos(angle)
    );

  active.angle = 0;
  active.top = topBound;
  active.left = leftBound;
  let box = getImageCropBox(topBound, leftBound, active);
  canvas.add(box);
  canvas.setActiveObject(box);
  dispatch({ type: 'setCurrentCoords', data: box.lineCoords });
  setAcitveEl(active);
  setCropbox(box);
};

export const cropImage = (active, box, setCropped) => {
  let ratioX = box.scaleX / active.scaleX;
  let ratioY = box.scaleY / active.scaleY;
  let newTop = (box.top - active.top) / active.scaleY;
  let newLeft = (box.left - active.left) / active.scaleX;

  let rect = new fabric.Rect({
    fill: 'rgba(0,0,0,0)',
    top: newTop,
    left: newLeft,
    width: box.width,
    height: box.height,
    scaleX: ratioX,
    scaleY: ratioY,
    absolutePositioned: true,
  });

  let newCanvas = new fabric.Canvas();
  newCanvas.setDimensions({
    width: active.width,
    height: active.height,
  });
  fabric.Image.fromURL(active._element.currentSrc, (image) => {
    newCanvas.add(image);
    newCanvas.add(rect);
    newCanvas.requestRenderAll();
    let src = newCanvas.toDataURL({
      left: rect.left,
      top: rect.top,
      width: rect.width * rect.scaleX,
      height: rect.height * rect.scaleY,
    });
    fabric.Image.fromURL(src, (img) => {
      img.scaleToWidth(box.width * box.scaleX);
      img.id = active.id;
      setCropped(img);
    });
  });
};
