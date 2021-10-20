import { useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { checkOffScreen } from '../utils/updateCanvas';

const useAddSpeakers = (
  video,
  canvas,
  currentTime,
  speakers,
  objectIdCount,
  setObjectIdCount,
  isCanvasData,
  setSpeakerVideos
) => {
  const [isFirtLoad, setIsFirtLoad] = useState(true);

  const newVideo = useCallback((video, speaker, id) => {
    return new fabric.Video(video, {
      id,
      left: speaker.x,
      top: speaker.y,
      width: speaker.w,
      height: speaker.h,
      stroke: 'rgba(255,255,255,1)',
      cropRect: { ...speaker },
    });
  }, []);

  useEffect(() => {
    if (isFirtLoad && !isCanvasData && video && canvas) {
      setIsFirtLoad(false);
      // console.log(speakers);
      let videos = [];
      let lastId = objectIdCount;
      if (speakers.length > 0) {
        for (let i = 0; i < speakers.length; i++) {
          let speaker = speakers[i];
          let speakerVideo = newVideo(video, speaker, lastId);
          canvas.add(speakerVideo);
          lastId++;
          checkOffScreen(speakerVideo, canvas, canvas.resize, null);
          videos.push(speakerVideo);
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
        checkOffScreen(speakerVideo, canvas, canvas.resize, null);
        videos.push(speakerVideo);
      }
      setSpeakerVideos(videos);
      setObjectIdCount(lastId);
    }
  }, [
    isCanvasData,
    objectIdCount,
    setObjectIdCount,
    video,
    canvas,
    isFirtLoad,
    newVideo,
    speakers,
    setSpeakerVideos,
  ]);
};

export default useAddSpeakers;
