import React, { useState, useRef } from 'react';
import styles from './CustomPlayer.module.css';
import Controls from './Controls/Controls';

const CustomPlayer = ({ url }) => {
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const setVideoDuration = () => {
    setDuration(videoRef.current.duration);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleEnd = () => {};

  const handleTimeUpdate = () => {
    setTime(videoRef.current.currentTime);
  };

  return (
    <div className={styles.VideoContainer} ref={containerRef}>
      <video
        className={styles.Video}
        src={url}
        preload='auto'
        ref={videoRef}
        controls
        onLoadedMetadata={setVideoDuration}
        onTimeUpdate={handleTimeUpdate}
        onPause={handlePause}
        onPlay={handlePlay}
        onEnded={handleEnd}
      />
      {duration ? (
        <Controls
          video={videoRef.current}
          container={containerRef.current}
          duration={duration}
          time={time}
          setTime={setTime}
          isPlaying={isPlaying}
        />
      ) : null}
    </div>
  );
};

export default CustomPlayer;
