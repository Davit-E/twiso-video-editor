import React, { useRef, useContext, useState } from 'react';
import styles from './Player.module.css';
import Canvas from '../Canvas/Canvas';
import EventContext from '../../contexts/EventContext';
import useEventState from '../../hooks/useEventsState';
import EditorContext from '../../contexts/EditorContext';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import play from '../../assets/editor/play.svg';
import usePlayerSize from './playerHooks/usePlayerSize';
import usePlayerTime from './playerHooks/usePlayerTime';
import useSubtitles from './playerHooks/useSubtitles';
import { getPlayerSize, playClickHandler } from '../utils/playerEvents';

const Player = ({
  videoRef,
  canvas,
  setCanvas,
  isPlaying,
  words,
  currentTime,
  videoSize,
  videoCuts,
  setNextCutIndex,
  setCurrentWordIndex,
  nextCutIndex,
  currentWordIndex,
  subArr,
  setSubArr,
  currentSub,
  setCurrentSub,
  currentSubIndex,
  setCurrentSubIndex,
  shouldRerenderSub,
  setShouldRerenderSub,
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [eventState, eventDispatch] = useEventState();
  const [playerSize, setPlayerSize] = useState(null);
  const playerRef = useRef(null);
  const isFirstLoad = useRef(true);
  usePlayerSize(
    isFirstLoad,
    videoSize,
    playerSize,
    editorDispatch,
    getPlayerSize,
    playerRef,
    setPlayerSize
  );

  usePlayerTime(
    videoRef,
    videoCuts,
    words,
    isPlaying,
    currentTime,
    nextCutIndex,
    setNextCutIndex,
    currentWordIndex,
    setCurrentWordIndex,
    subArr,
    currentSubIndex,
    setCurrentSubIndex,
    currentSub
  );

  useSubtitles(
    editorState,
    canvas,
    currentSub,
    setCurrentSub,
    words,
    subArr,
    setSubArr,
    currentSubIndex,
    setCurrentSubIndex,
    currentWordIndex,
    videoCuts,
    shouldRerenderSub,
    setShouldRerenderSub,
    isPlaying,
    videoRef
  );

  return (
    <div className={styles.Player} ref={playerRef}>
      <EventContext.Provider value={{ eventState, eventDispatch }}>
        {/* <p className={styles.Sub}>Adina Jackson family,</p> */}
        <div className={styles.PlayerContent}>
          <Canvas
            canvas={canvas}
            setCanvas={setCanvas}
            video={videoRef.current}
            currentSub={currentSub}
            currentTime={currentTime}
          />
          {canvas ? (
            <>
              <div className={styles.PlayerControls}>
                <div
                  className={styles.PlayButton}
                  onClick={() =>
                    playClickHandler(isPlaying, videoRef, editorState)
                  }
                >
                  <img src={play} alt='play' />
                </div>
              </div>
              <CanvasToolbar />
            </>
          ) : null}
        </div>
      </EventContext.Provider>
    </div>
  );
};

export default Player;
