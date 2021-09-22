import React, { useState, useRef } from 'react';
import styles from './CustomPlayer.module.css';
import Controls from './Controls/Controls';

const CustomPlayer = ({ url }) => {
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const setVideoDuration = () => setDuration(videoRef.current.duration);
  const handleTimeUpdate = () => setTime(videoRef.current.currentTime);
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  return (
    <div className={styles.VideoContainer} ref={containerRef}>
      <video
        className={styles.Video}
        src={url}
        preload='auto'
        ref={videoRef}
        onLoadedMetadata={setVideoDuration}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
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
