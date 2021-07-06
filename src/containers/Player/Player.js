import React, { useState, useEffect, useRef } from 'react';
import styles from './Player.module.css';
import Canvas from '../Canvas/Canvas';
import EventContext from '../../contexts/EventContext';
import useEventState from '../../hooks/useEventsState';

const Player = ({
  viedoForUpload,
  videoRef,
  handleEnd,
  handlePause,
  handlePlay,
  canvas,
  setCanvas,
  duration,
}) => {
  const [eventState, eventDispatch] = useEventState();
  const [size, setSize] = useState(null);
  const playerRef = useRef(null);
  useEffect(() => {
    // console.log(size);
  }, [size]);

  const getDimensions = (e) => {
    let width = videoRef.current.videoWidth;
    let height = videoRef.current.videoHeight;
    setSize({ width, height });
  };

  return (
    <div className={styles.Player} ref={playerRef}>
      <video
        style={{ display: duration ? 'block' : 'none' }}
        // style={{ display: 'none' }}
        className={styles.Video}
        ref={videoRef}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnd}
        onLoadedMetadata={getDimensions}
      />
      <EventContext.Provider value={{ eventState, eventDispatch }}>
        {/* <Canvas canvas={canvas} setCanvas={setCanvas} size={size} /> */}
      </EventContext.Provider>
    </div>
  );
};

export default Player;
