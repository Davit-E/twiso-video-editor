import React, { useState, useRef, useCallback } from 'react';
import styles from './Controls.module.css';
import playSvg from '../../../assets/preview/play.svg';
import pauseSvg from '../../../assets/preview/pause.svg';
import fullScreenSvg from '../../../assets/preview/fullScreen.svg';
import { fullScreenHanlder } from './utils/fullScreen';
import Time from './Time/Time';
import Volume from './Volume/Volume';
import useSingleAndDoubleClick from './hooks/useSingleAndDoubleClick';
import useShowHidePanel from './hooks/useShowHidePanel';
import useKeyEvents from './hooks/useKeyEvents';

const Controls = ({ video, container, duration, time, setTime, isPlaying }) => {
  const [volume, setVolume] = useState('1');
  const [shouldShowPanel, setShouldShowPanel] = useState(false);
  const controlsRef = useRef(null);
  const panelRef = useRef(null);
  const playPause = useCallback(() => {
    if (isPlaying) video.pause();
    else video.play();
  }, [isPlaying, video]);

  const fullScreen = useCallback(() => {
    fullScreenHanlder(container);
  }, [container]);

  useKeyEvents(video, playPause, setVolume, setShouldShowPanel);
  useSingleAndDoubleClick(playPause, fullScreen, controlsRef);
  useShowHidePanel(
    isPlaying,
    controlsRef,
    panelRef,
    styles.Visible,
    styles.Hover,
    shouldShowPanel,
    setShouldShowPanel
  );

  return (
    <div id='controls' className={styles.Controls} ref={controlsRef}>
      <div className={styles.ControlsPanel} ref={panelRef}>
        <button className={styles.PlayPause} onClick={playPause}>
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
    </div>
  );
};

export default Controls;
