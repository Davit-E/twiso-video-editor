import React, { useState, useEffect, useContext } from 'react';
import styles from './Video.module.css';
import { handlePlay, handleEnd, handlePause } from './utils/videoEvents';
import EditorContext from '../../contexts/EditorContext';

const Video = ({
  videoRef,
  setIsPlaying,
  currentSelection,
  setCurrentSelection,
  setCurrentTime,
  videoCuts,
  words,
  setNextCutIndex,
  setCurrentWordIndex,
  setCurrentSub,
  subList,
  info,
}) => {
  const { editorDispatch } = useContext(EditorContext);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const getVideoSize = () => {
    let initialWidth = videoRef.current.videoWidth;
    let initialHeight = videoRef.current.videoHeight;
    editorDispatch({
      type: 'setCanvasInitialSize',
      data: { initialWidth, initialHeight },
    });
    let data = {};
    if (info.canvas && info.canvas.width) {
      data = {
        width: +info.canvas.width,
        height: +info.canvas.height,
        resize: info.canvas.resize,
      };
    } else {
      data = {
        width: initialWidth,
        height: initialHeight,
        resize: 'original',
      };
    }
    editorDispatch({ type: 'setVideoSize', data });
  };

  return (
    <video
      src={info ? info.url : null}
      id='video'
      preload='auto'
      className={styles.Video}
      ref={videoRef}
      controls
      onPause={() => handlePause(setIsPlaying, intervalId, words)}
      onPlay={() =>
        handlePlay(
          currentSelection,
          setCurrentSelection,
          setIsPlaying,
          setCurrentTime,
          videoRef,
          setIntervalId,
          words
        )
      }
      onEnded={() =>
        handleEnd(
          videoCuts,
          setNextCutIndex,
          words,
          setCurrentWordIndex,
          setCurrentTime,
          setCurrentSub,
          subList
        )
      }
      onLoadedMetadata={getVideoSize}
    />
  );
};

export default Video;
