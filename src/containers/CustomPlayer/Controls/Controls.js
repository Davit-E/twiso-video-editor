import React, { useState, useEffect } from 'react';
import styles from './Controls.module.css';
import playSvg from '../../../assets/preview/play.svg';
// import pauseSvg from '../../../assets/preview/pause.svg';
import volumeSvg from '../../../assets/preview/volume.svg';
import fullScreenSvg from '../../../assets/preview/fullScreen.svg';
import TimelineSlider from './TimelineSlider/TimelineSlider';
import { fullScreenHanlder } from './utils/fullScreen';

const Controls = ({ video, container, duration }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState('1');
  const [time, setTime] = useState('0');

  useEffect(() => {
    video.volume = volume;
  }, [video, volume]);

  // const handleScreenChange = useCallback((e) => {
  //   let data = null;
  //   if (document.fullscreenElement) data = true;
  //   else data = false;
  //   setIsFullScreen(data);
  // }, []);

  // useEffect(() => {
  //   container.addEventListener('fullscreenchange', handleScreenChange);
  //   return () =>
  //     container.removeEventListener('fullscreenchange', handleScreenChange);
  // }, [container, handleScreenChange]);

  return (
    <div className={styles.Controls}>
      <button className={styles.PlayPause}>
        <img src={playSvg} alt='play' />
      </button>
      <div className={styles.Time}>00:00</div>
      <div className={styles.Timeline}>
        <TimelineSlider
          min='0'
          max={duration}
          step='0.1'
          value={time}
          setValue={setTime}
        />
      </div>
      <button className={styles.Volume}>
        <div className={styles.VolumeButton}>
          <img src={volumeSvg} alt='volume' />
        </div>
        <div className={styles.VolumeBar}>
          <TimelineSlider
            min='0'
            max='1'
            step='0.1'
            value={volume}
            setValue={setVolume}
          />
        </div>
      </button>

      <button
        className={styles.FullScreen}
        onClick={() => fullScreenHanlder(container, setIsFullScreen)}
      >
        <img src={fullScreenSvg} alt='full screen' />
      </button>
    </div>
  );
};

export default Controls;
