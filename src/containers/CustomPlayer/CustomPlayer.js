import React, { useState, useRef } from 'react';
import styles from './CustomPlayer.module.css';
import Controls from './Controls/Controls';

const CustomPlayer = ({ url }) => {
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const setVideoDuration = () => {
    setDuration(videoRef.current.duration);
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
      />
      {duration ? (
        <Controls
          video={videoRef.current}
          container={containerRef.current}
          duration={duration}
        />
      ) : null}
    </div>
  );
};

export default CustomPlayer;
