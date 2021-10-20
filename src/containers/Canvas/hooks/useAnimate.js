import { useEffect, useRef, useCallback, useState } from 'react';
import { fabric } from 'fabric';

const useAnimate = (
  isCanvasSet,
  canvas,
  speakerVideos,
  isPlaying,
  video,
  currentTime
) => {
  const [isFirstLoad, setIsFirstLoad] = useState(null);
  const isMounted = useRef(true);
  const frameRef = useRef(null);

  const cancelAnimation = useCallback(
    (speakers) => {
      // console.log('canceling', frameRef.current);
      fabric.util.cancelAnimFrame(frameRef.current);
      // for (let i = 0; i < speakers.length; i++) {
      //   speakers[i].dirty = false;
      // }
      frameRef.current = null;
      if (canvas) canvas.requestRenderAll();
    },
    [canvas]
  );

  const animate = useCallback(
    (speakers) => {
      if (frameRef.current) fabric.util.cancelAnimFrame(frameRef.current);
      const render = () => {
        canvas.requestRenderAll();
        for (let i = 0; i < speakers.length; i++) {
          speakers[i].dirty = true;
        }
        // console.log('animating');
        frameRef.current = fabric.util.requestAnimFrame(render);
      };
      fabric.util.requestAnimFrame(render);
    },
    [canvas]
  );

  useEffect(() => {
    if (isCanvasSet) {
      animate(speakerVideos);
      // if (isPlaying) animate(speakerVideos);
      // else cancelAnimation(speakerVideos);
    }
  }, [isCanvasSet, animate, cancelAnimation, isPlaying, speakerVideos]);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      video.currentTime = currentTime > 0 ? currentTime : 0.001;
    }
  }, [isFirstLoad, currentTime, video]);

  useEffect(() => {
    return () => {
      if (frameRef.current) fabric.util.cancelAnimFrame(frameRef.current);
    };
  }, []);

  useEffect(() => () => (isMounted.current = false), []);
};

export default useAnimate;
