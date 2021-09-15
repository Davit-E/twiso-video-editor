import React, { useState } from 'react';
import styles from './Controls.module.css';
import playSvg from '../../../assets/preview/play.svg';
import pauseSvg from '../../../assets/preview/pause.svg';
import fullScreenSvg from '../../../assets/preview/fullScreen.svg';
import { fullScreenHanlder } from './utils/fullScreen';
import Time from './Time/Time';
import Volume from './Volume/Volume';
import { useEffect } from 'react/cjs/react.development';

const Controls = ({ video, container, duration, time, setTime, isPlaying }) => {
  const [volume, setVolume] = useState('1');

  const playPauseHanlder = () => {
    if (isPlaying) video.pause();
    else video.play();
  };

  const keydownHandler = (e) => {
    console.log(e);
    console.log(document.activeElement);
  };

  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, []);

  return (
    <div className={styles.Controls}>
      <button className={styles.PlayPause} onClick={playPauseHanlder}>
        {isPlaying ? (
          <img src={pauseSvg} alt='pause' />
        ) : (
          <img src={playSvg} alt='play' />
        )}
      </button>
      <Time
        duration={duration}
        time={time}
        setTime={setTime}
        isPlaying={isPlaying}
        video={video}
      />
      <Volume video={video} volume={volume} setVolume={setVolume} />
      <button
        className={styles.FullScreen}
        onClick={() => fullScreenHanlder(container)}
      >
        <img src={fullScreenSvg} alt='full screen' />
      </button>
    </div>
  );
};

export default Controls;
