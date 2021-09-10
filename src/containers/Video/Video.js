import React, { useState, useEffect } from 'react';
import styles from './Video.module.css';
import { getVideoSize } from '../../utils/getSize';
import { handlePlay, handleEnd, handlePause } from './utils/videoEvents';

const Video = ({
  videoRef,
  setIsPlaying,
  currentSelection,
  setCurrentSelection,
  setCurrentTime,
  videoSize,
  videoCuts,
  words,
  setVideoSize,
  setNextCutIndex,
  setCurrentWordIndex,
  setCurrentSub,
  subList,
}) => {
  const [intervalId, setIntervalId] = useState(null);
  // const seeking = (e) => {
  //   console.log(e);
  //   console.log(videoRef.current.seekable);
  // };

  // const seeked = (e) => {
  //   console.log(e);
  //   console.log(videoRef.current.seekable);
  // };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <video
      // style={{ display: viedoForUpload ? 'block' : 'none' }}
      width={videoSize ? videoSize.width : 0}
      height={videoSize ? videoSize.height : 0}
      id='video'
      preload='auto'
      className={styles.Video}
      ref={videoRef}
      controls
      onPause={() => handlePause(setIsPlaying, intervalId)}
      onPlay={() =>
        handlePlay(
          currentSelection,
          setCurrentSelection,
          setIsPlaying,
          setCurrentTime,
          videoRef,
          setIntervalId
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
      onLoadedMetadata={() => getVideoSize(videoRef, setVideoSize)}
      // onSeeking={seeking}
      // onSeeked={seeked}
    />
  );
};

export default Video;
