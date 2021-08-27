import { useEffect, useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';

const useAddVideo = (
  video,
  canvas,
  currentTime,
  isPlayer,
  setVideo,
  speakers
) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);
  const isMounted = useRef(true);
  const frameRef = useRef(null);
  useEffect(() => () => (isMounted.current = false), []);

  const cancelAnimation = useCallback(() => {
    // console.log('canceling', frameRef.current);
    fabric.util.cancelAnimFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const animate = useCallback(() => {
    const render = () => {
      canvas.requestRenderAll();
      // console.log('animating');
      frameRef.current = fabric.util.requestAnimFrame(render);
    };
    fabric.util.requestAnimFrame(render);
  }, [canvas]);

  const newVideo = useCallback((video, speaker) => {
    let fabricVideo = new fabric.Video(video, {
      top: 0,
      left: 0,
      excludeFromExport: true,
      lockScalingFlip: true,
    });
    if (speaker) {
      fabricVideo.left = speaker.x;
      fabricVideo.top = speaker.y;
      fabricVideo.width = speaker.w;
      fabricVideo.height = speaker.h;
      fabricVideo.cropRect = { ...speaker };
    }
    fabricVideo.controls.mtr.visible = false;
    return fabricVideo;
  }, []);

  useEffect(() => {
    if (!isPlayer) {
      if (isFirtLoad) {
        setTimeout(() => {
          if (isMounted.current) cancelAnimation();
        }, 1000);
      }
    }
  }, [isPlayer, cancelAnimation, isFirtLoad]);

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
      if (speakers && speakers.length > 0) {
        for (let i = 0; i < speakers.length; i++) {
          const speaker = speakers[i];
          let speakerVideo = newVideo(video, speaker);
          canvas.add(speakerVideo);
        }
      } else {
        let fabricVideo = newVideo(video);
        canvas.add(fabricVideo);
        if (!isPlayer) {
          fabricVideo.evented = false;
          fabricVideo.selectable = false;
          setVideo(fabricVideo);
        }
      }
      animate();
    }
  }, [
    video,
    canvas,
    isFirtLoad,
    currentTime,
    animate,
    isPlayer,
    setVideo,
    newVideo,
    speakers,
  ]);
};

export default useAddVideo;
