import React, { useEffect, useRef } from 'react';
import styles from './Volume.module.css';
import volumeSvg from '../../../../assets/preview/volume.svg';
import VolumeSlider from './VolumeSlider/VolumeSlider';

const Volume = ({ video, volume, setVolume }) => {
  const volumeRef = useRef('1');
  const volumeLastRef = useRef('1');

  useEffect(() => {
    volumeLastRef.current = video.volume;
    if (+volume !== 0) volumeRef.current = volume;
    video.volume = volume;
  }, [video, volume]);

  const volumeClickHandler = () => {
    if (+volume === 0 && +volumeRef.current > 0) setVolume(volumeRef.current);
    else if (+volume === 0 && +volumeLastRef.current !== 0) {
      volumeRef.current = volumeLastRef.current;
      setVolume(volumeLastRef.current);
    } else if (+volume === 0) {
      volumeRef.current = '1';
      setVolume('1');
    } else {
      volumeRef.current = volume;
      setVolume('0');
    }
  };

  return (
    <button className={styles.Volume}>
      <div className={styles.VolumeButton} onClick={volumeClickHandler}>
        <img src={volumeSvg} alt='volume' />
        {+volume === 0 ? <div className={styles.VolumeOff}></div> : null}
      </div>
      <div className={styles.VolumeBar}>
        <VolumeSlider
          min='0'
          max='1'
          step='0.1'
          value={volume}
          setValue={setVolume}
        />
      </div>
    </button>
  );
};

export default Volume;
