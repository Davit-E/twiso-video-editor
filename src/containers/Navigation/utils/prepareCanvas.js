import { fabric } from 'fabric';

// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

const getVideoInfo = (video, i) => ({
  position: {
    x: video.left,
    y: video.top,
    w: video.width * video.scaleX,
    h: video.height * video.scaleY,
    z: i,
    crop: video.cropRect,
  },
});

const generateLayer = (exportCanvas, width, height, arr, z) => {
  exportCanvas.renderAll();
  let image = exportCanvas.toDataURL({
    format: 'image/jpg',
    quality: 1,
  });
  arr.push({
    image,
    position: {
      x: 0,
      y: 0,
      w: width,
      h: height,
      z,
    },
  });
  exportCanvas.clear();
  exportCanvas.backgroundColor = 'rgba(255, 255, 255, 0)';
};

const handleLayers = (exportCanvas, canvas, setElements, setVideoInfo) => {
  let objects = canvas.getObjects();
  let width = canvas.getWidth() / canvas.getZoom();
  let height = canvas.getHeight() / canvas.getZoom();
  let videosArr = [];
  let elementsArr = [];
  let isAdded = true;
  let index = 1;
  generateLayer(exportCanvas, width, height, elementsArr, 0);
  for (let i = 0; i < objects.length; i++) {
    let el = objects[i];
    if (el.type === 'subtitle' && isAdded) {
      generateLayer(exportCanvas, width, height, elementsArr, index);
      isAdded = false;
    } else if (el.type === 'subtitle') continue;
    else if (el.type === 'video') {
      if (isAdded) {
        generateLayer(exportCanvas, width, height, elementsArr, index);
        index++;
        isAdded = false;
      }
      videosArr.push(getVideoInfo(el, index));
      index++;
    } else if (el.type !== 'video' && el.type !== 'subtitle') {
      let clone = fabric.util.object.clone(el);
      exportCanvas.add(clone);
      isAdded = true;
    }
  }
  if (isAdded) generateLayer(exportCanvas, width, height, elementsArr, index);
  setVideoInfo({ coordinates: videosArr });
  setElements(elementsArr);
};

export const prepareCanvas = async (canvas, setElements, setVideoInfo) => {
  // let jsonCanvas = JSON.stringify(canvas)
  // localStorage.setItem('canvas', jsonCanvas);
  let exportCanvas = new fabric.Canvas();
  exportCanvas.setDimensions({
    width: canvas.getWidth() / canvas.getZoom(),
    height: canvas.getHeight() / canvas.getZoom(),
  });
  exportCanvas.backgroundColor = canvas.backgroundColor;
  handleLayers(exportCanvas, canvas, setElements, setVideoInfo);
};
