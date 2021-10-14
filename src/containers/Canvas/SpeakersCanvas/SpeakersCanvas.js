import React, { useState, useCallback } from 'react';
import styles from './SpeakersCanvas.module.css';
import useAddCanvas from './hooks/useAddCanvas';
import useAddVideo from './hooks/useAddVideo';
import useUpdateCanvas from './hooks/useUpdateCanvas';
import useGuideLines from '../hooks/useGuideLines';
import useCropSpeakers from '../hooks/useCropSpeakers';

const SpeakersCanvas = ({
  canvas,
  setCanvas,
  canvasState,
  canvasDispatch,
  videoRef,
  setBoxArr,
  duration,
  boxArr,
}) => {
  const [isCanvasSet, setIsCanvasSet] = useState(null);
  const [video, setVideo] = useState(null);
  const [boxId, setBoxId] = useState(1);
  const updateBoxId = useCallback(() => setBoxId((i) => i + 1), []);

  useGuideLines(canvasState, isCanvasSet, canvas, null, null);
  useUpdateCanvas(canvasState, canvasDispatch, canvas);
  useAddCanvas(canvasState, setCanvas, setIsCanvasSet, 'speakerCanvas');
  useAddVideo(videoRef.current, canvas, duration / 10, setVideo);
  useCropSpeakers(
    canvas,
    video,
    boxArr,
    setBoxArr,
    boxId,
    updateBoxId
  );

  return (
    <div className={styles.Canvas}>
      <canvas id='speakerCanvas' />
    </div>
  );
};

export default SpeakersCanvas;
