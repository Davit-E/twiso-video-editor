import { useEffect, useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';

const useAddVideo = (
  video,
  canvas,
  currentTime,
  speakers,
  objectIdCount,
  setObjectIdCount,
  isCanvasData
) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);
  const isMounted = useRef(true);
  const frameRef = useRef(null);

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
      cornerRadius: 0,
      cropRect: { ...speaker },
    });
  }, []);

  useEffect(() => {
    if (isFirtLoad && video && canvas) {
      setIsFirtLoad(false);
      if (!isCanvasData) {
        // console.log(speakers);
        video.currentTime = currentTime > 0 ? currentTime : 0.001;
        let lastId = objectIdCount;
        if (speakers.length > 0) {
          for (let i = 0; i < speakers.length; i++) {
            const speaker = speakers[i];
            let speakerVideo = newVideo(video, speaker, lastId);
            canvas.add(speakerVideo);
            lastId++;
          }
        } else {
          let speakerVideo = newVideo(
            video,
            { w: video.videoWidth, h: video.videoHeight, x: 0, y: 0 },
            lastId
          );
          // console.log(speakerVideo);
          canvas.add(speakerVideo);
          lastId++;
        }
        setObjectIdCount(lastId)
      }
      animate();
    }
  }, [
    isCanvasData,
    objectIdCount,
    setObjectIdCount,
    video,
    canvas,
    isFirtLoad,
    currentTime,
    animate,
    newVideo,
    speakers,
  ]);

  useEffect(() => () => (isMounted.current = false), []);

  useEffect(() => {
    return () => {
      if (!isMounted.current && frameRef.current) {
        fabric.util.cancelAnimFrame(frameRef.current);
      }
    };
  }, []);
};

export default useAddVideo;
