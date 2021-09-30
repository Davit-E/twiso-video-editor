import React, { useRef, useContext, useState } from 'react';
import styles from './Player.module.css';
import PlayerCanvas from '../Canvas/PlayerCanvas/PlayerCanvas';
import EventContext from '../../contexts/EventContext';
import useEventState from '../../hooks/useEventsState';
import EditorContext from '../../contexts/EditorContext';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import play from '../../assets/editor/play.svg';
import useContainerSize from '../../hooks/useContainerSize';
import usePlayerTime from './hooks/usePlayerTime';
import useSubtitles from './hooks/useSubtitles';

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
  subList,
  setSubList,
  fabricSub,
  setFabricSub,
  currentSub,
  setCurrentSub,
  shouldRerenderSub,
  setShouldRerenderSub,
  speakers,
  info,
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [eventState, eventDispatch] = useEventState();
  const [containerSize, setContainerSize] = useState(null);
  const containerPadding = 32;
  const containerRef = useRef(null);
  const playClickHandler = () => {
    if (isPlaying) videoRef.current.pause();
    else if (!editorState.isCropMode && !editorState.shouldCropImage) {
      videoRef.current.play();
    }
  };

  useContainerSize(
    videoSize,
    containerSize,
    editorDispatch,
    containerRef,
    setContainerSize,
    containerPadding
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
    currentSub,
    setCurrentSub,
    fabricSub
  );

  useSubtitles(
    editorState,
    canvas,
    fabricSub,
    setFabricSub,
    words,
    subList,
    setSubList,
    currentSub,
    setCurrentSub,
    currentWordIndex,
    videoCuts,
    shouldRerenderSub,
    setShouldRerenderSub,
    isPlaying,
    videoRef
  );

  return (
    <div className={styles.Player} ref={containerRef}>
      <EventContext.Provider value={{ eventState, eventDispatch }}>
        {/* <p className={styles.Sub}>Adina Jackson family,</p> */}
        <div className={styles.PlayerContent}>
          <PlayerCanvas
            canvas={canvas}
            setCanvas={setCanvas}
            video={videoRef.current}
            fabricSub={fabricSub}
            currentTime={currentTime}
            speakers={speakers}
            info={info}
          />
          {canvas ? (
            <>
              <div className={styles.PlayerControls}>
                <div className={styles.PlayButton} onClick={playClickHandler}>
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
