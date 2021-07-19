import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import styles from './Player.module.css';
import Canvas from '../Canvas/Canvas';
import EventContext from '../../contexts/EventContext';
import useEventState from '../../hooks/useEventsState';
import AppContext from '../../contexts/AppContext';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import play from '../../assets/play.svg';
const Player = ({
  viedoForUpload,
  videoRef,
  handleEnd,
  handlePause,
  handlePlay,
  canvas,
  setCanvas,
  duration,
  isPlaying,
}) => {
  const { appState, appDispatch } = useContext(AppContext);
  const [eventState, eventDispatch] = useEventState();
  const [videoSize, setVideoSize] = useState(null);
  const [playerSize, setPlayerSize] = useState(null);
  const playerRef = useRef(null);
  const playerPadding = 32;
  const isFirtLoad = useRef(true);
  const getPlayerSize = useCallback(() => {
    let width =
      window.innerWidth - playerRef.current.offsetLeft - playerPadding;
    let height = playerRef.current.offsetHeight;
    // console.log(width, height);
    if (width > 800) {
      height = (height * 800) / width;
      width = 800;
    }
    setPlayerSize({ width, height });
  }, []);

  useEffect(() => {
    if (videoSize && playerSize) {
      // console.log('video: ', videoSize);
      // console.log('player: ', playerSize);
      let width = playerSize.width;
      let height = (videoSize.height * width) / videoSize.width;
      // console.log(width, height);
      let isInRange = width > 100;
      if (isFirtLoad.current && isInRange) {
        isFirtLoad.current = false;
        appDispatch({
          type: 'setCanvasInitialSize',
          data: {
            initialWidth: videoSize.width,
            initialHeight: videoSize.height,
            width,
            height,
          },
        });
      } else if (isInRange) {
        appDispatch({ type: 'setCanvasSize', data: { width, height } });
      }
    }
  }, [isFirtLoad, playerSize, videoSize, appDispatch]);

  useEffect(() => {
    if (appState.isCropMode) {
      videoRef.current.pause();
    }
  }, [appState.isCropMode, videoRef]);

  useEffect(() => {
    window.addEventListener('resize', getPlayerSize);
    return () => window.removeEventListener('resize', getPlayerSize);
  }, [getPlayerSize]);
  useEffect(() => {
    if (viedoForUpload) {
      videoRef.current.src = URL.createObjectURL(viedoForUpload);
    }
  }, [viedoForUpload, videoRef]);

  const getDimensions = (e) => {
    let width = videoRef.current.videoWidth;
    let height = videoRef.current.videoHeight;
    setVideoSize({ width, height });
    getPlayerSize();
  };

  const playClickHandler = () => {
    if (isPlaying) videoRef.current.pause();
    else if (!appState.isCropMode && !appState.shouldCropImage) {
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.Player} ref={playerRef}>
      <video
        // style={{ display: viedoForUpload ? 'block' : 'none' }}
        width={videoSize ? videoSize.width : 0}
        height={videoSize ? videoSize.height : 0}
        id='video'
        preload='true'
        className={styles.Video}
        ref={videoRef}
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnd}
        onLoadedMetadata={getDimensions}
      />
      <EventContext.Provider value={{ eventState, eventDispatch }}>
        <div className={styles.PlayerContent}>
          <Canvas
            canvas={canvas}
            setCanvas={setCanvas}
            video={videoRef.current}
          />
          {canvas ? (
            <>
              <div className={styles.PlayerControls}>
                <div className={styles.PlayButton} onClick={playClickHandler}>
                  <img src={play} alt='play' />
                </div>
              </div>
              <CanvasToolbar player={playerRef.current} />
            </>
          ) : null}
        </div>
      </EventContext.Provider>
    </div>
  );
};

export default Player;
