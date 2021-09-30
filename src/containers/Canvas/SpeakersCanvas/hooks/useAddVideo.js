import { useEffect, useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';

const useAddVideo = (video, canvas, currentTime, setVideo) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);
  const isMounted = useRef(true);
  const frameRef = useRef(null);
  useEffect(() => () => (isMounted.current = false), []);

  const cancelAnimation = useCallback(() => {
    // console.log('canceling', frameRef.current);
    fabric.util.cancelAnimFrame(frameRef.current);
    frameRef.current = null;
    if (canvas) canvas.requestRenderAll();
  }, [canvas]);

  const animate = useCallback(() => {
    const render = () => {
      canvas.requestRenderAll();
      // console.log('animating');
      frameRef.current = fabric.util.requestAnimFrame(render);
    };
    fabric.util.requestAnimFrame(render);
  }, [canvas]);

  const newVideo = useCallback((video) => {
    let fabricVideo = new fabric.Video(video, {
      top: 0,
      left: 0,
      // excludeFromExport: true,
      lockScalingFlip: true,
    });
    return fabricVideo;
  }, []);

  useEffect(() => {
    if (isFirtLoad) {
      setTimeout(() => {
        if (isMounted.current) cancelAnimation();
      }, 1000);
    }
  }, [cancelAnimation, isFirtLoad]);

  useEffect(() => {
    return () => {
      if (!isMounted.current && frameRef.current) {
        fabric.util.cancelAnimFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFirtLoad && video && canvas) {
      setIsFirtLoad(false);
      video.currentTime = currentTime > 0 ? currentTime : 0.001;
      let fabricVideo = newVideo(video);
      canvas.add(fabricVideo);
      fabricVideo.evented = false;
      fabricVideo.selectable = false;
      setVideo(fabricVideo);
      animate();
    }
  }, [
    video,
    canvas,
    isFirtLoad,
    currentTime,
    animate,
    setVideo,
    newVideo,
  ]);
};

export default useAddVideo;
