import { useEffect, useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';

const useAddVideo = (
  video,
  canvas,
  currentTime,
  speakers,
  idCount,
  updateId,
  isCanvasData
) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);
  const isMounted = useRef(true);
  const frameRef = useRef(null);
  useEffect(() => () => (isMounted.current = false), []);

  const animate = useCallback(() => {
    const render = () => {
      canvas.requestRenderAll();
      // console.log('animating');
      frameRef.current = fabric.util.requestAnimFrame(render);
    };
    fabric.util.requestAnimFrame(render);
  }, [canvas]);

  const newVideo = useCallback((video, speaker, id) => {
    return new fabric.Video(video, {
      id,
      lockScalingFlip: true,
      left: speaker.x,
      top: speaker.y,
      width: speaker.w,
      height: speaker.h,
      cropRect: { ...speaker },
    });
  }, []);

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
      if (!isCanvasData) {
        // console.log(speakers);
        video.currentTime = currentTime > 0 ? currentTime : 0.001;
        if (speakers.length > 0) {
          for (let i = 0; i < speakers.length; i++) {
            const speaker = speakers[i];
            let speakerVideo = newVideo(video, speaker, i + 1);
            canvas.add(speakerVideo);
            updateId();
          }
        } else {
          let speakerVideo = newVideo(
            video,
            { w: video.videoWidth, h: video.videoHeight, x: 0, y: 0 },
            1
          );
          // console.log(speakerVideo);
          canvas.add(speakerVideo);
          updateId();
        }
      }
      animate();
    }
  }, [
    isCanvasData,
    updateId,
    video,
    canvas,
    isFirtLoad,
    currentTime,
    animate,
    newVideo,
    speakers,
  ]);
};

export default useAddVideo;
