import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

const useAddVideo = (video, canvas, currentTime) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);
  useEffect(() => {
    if (isFirtLoad && video && canvas) {
      setIsFirtLoad(false);
      let fabricVideo = new fabric.Image(video, {
        top: 0,
        left: 0,
        objectCaching: false,
        id: 'video',
        excludeFromExport: true,
        lockScalingFlip: true,
      });
      fabricVideo.controls.mtr.visible = false;
      canvas.add(fabricVideo);
      video.currentTime = currentTime > 0 ? currentTime : 0.001;
      // fabricVideo.scaleToWidth(canvas.getWidth());s
      fabricVideo.scaleToHeight(canvas.getHeight());
      // console.log(canvas.getHeight());
      // console.log(fabricVideo.height);
      // console.log(fabricVideo.height * fabricVideo.scaleY);
      // console.log('/////////////////////////////');
      // console.log(canvas.getWidth());
      // console.log(fabricVideo.width);
      // console.log(fabricVideo.width * fabricVideo.scaleX);
      // fabricVideo.getElement().play();
      fabric.util.requestAnimFrame(function render() {
        canvas.requestRenderAll();
        fabric.util.requestAnimFrame(render);
      });
    }
  }, [video, canvas, isFirtLoad, currentTime]);
};

export default useAddVideo;
