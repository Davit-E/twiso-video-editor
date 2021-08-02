import React, { useState } from 'react';
import styles from './Video.module.css';
import {
  getDimensions,
  handlePlay,
  handleEnd,
  handlePause,
} from '../utils/playerEvents';

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
  setCurrentSubIndex,
  subArr,
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
  return (
    <video
      // style={{ display: viedoForUpload ? 'block' : 'none' }}
      width={videoSize ? videoSize.width : 0}
      height={videoSize ? videoSize.height : 0}
      id='video'
      preload='true'
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
          setCurrentSubIndex,
          subArr
        )
      }
      onLoadedMetadata={() => getDimensions(videoRef, setVideoSize)}
      // onSeeking={seeking}
      // onSeeked={seeked}
    />
  );
};

export default Video;
