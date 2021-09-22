import { fabric } from 'fabric';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const getVideoData = async (
  canvas,
  setVideoInfo,
  viedoForUpload,
  isMounted
) => {
  let objects = canvas.getObjects();
  let video = null;
  let videoIndex = 0;
  for (let i = 0; i < objects.length; i++) {
    let el = objects[i];
    if (el.type === 'video') {
      videoIndex = i;
      video = el;
      // console.log('angle: ', el.angle);
    }
  }

  let base64Video = null;
  if (viedoForUpload) base64Video = await toBase64(viedoForUpload);
  let info = {
    source: base64Video,
    coordinates: [
      {
        type: 'resize',
        position: {
          x: video.left,
          y: video.top,
          w: video.width * video.scaleX,
          h: video.height * video.scaleY,
          z: 1,
          degrees: 0,
        },
      },
    ],
  };
  if (isMounted.current) setVideoInfo(info);
  return videoIndex;
};

const handleFrontImg = (newCanvas, objects, index, setFrontImage) => {
  newCanvas.backgroundColor = 'rgba(255, 255, 255, 0)';
  let count = 0;
  for (let i = 0; i < objects.length; i++) {
    let el = objects[i];
    if (i >= index) {
      el.opacity = 1;
      count++;
    } else el.opacity = 0;
  }
  newCanvas.renderAll();
  if (count > 0) {
    let frontImg = newCanvas.toDataURL({
      format: 'image/jpg',
      quality: 1,
    });
    setFrontImage({
      image: frontImg,
      position: {
        x: 0,
        y: 0,
        w: newCanvas.getWidth(),
        h: newCanvas.getHeight(),
        z: 2,
      },
    });
  } else {
    setFrontImage(false);
  }
};

const handleBackImg = (newCanvas, objects, index, setBackImage) => {
  for (let i = 0; i < objects.length; i++) {
    let el = objects[i];
    if (i >= index) el.opacity = 0;
  }
  newCanvas.renderAll();
  let backImg = newCanvas.toDataURL({
    format: 'jpeg',
    quality: 1,
  });
  setBackImage({
    image: backImg,
    position: {
      x: 0,
      y: 0,
      w: newCanvas.getWidth(),
      h: newCanvas.getHeight(),
      z: 0,
    },
  });
};

export const prepareCanvas = async (
  canvas,
  setBackImage,
  setFrontImage,
  setVideoInfo,
  viedoForUpload,
  isMounted
) => {
  let videoIndex = await getVideoData(
    canvas,
    setVideoInfo,
    viedoForUpload,
    isMounted
  );
  let newCanvas = new fabric.Canvas();
  let jsonCanvas = JSON.stringify(canvas);
  newCanvas.loadFromJSON(jsonCanvas, () => {
    newCanvas.setDimensions({
      width: canvas.getWidth() / canvas.getZoom(),
      height: canvas.getHeight() / canvas.getZoom(),
    });
    let objects = newCanvas.getObjects();
    handleBackImg(newCanvas, objects, videoIndex, setBackImage);
    handleFrontImg(newCanvas, objects, videoIndex, setFrontImage);
  });
};
