import React, { useRef, useContext, useEffect } from 'react';
import styles from './Player.module.css';
import PlayerCanvas from '../Canvas/PlayerCanvas/PlayerCanvas';
import EventContext from '../../contexts/EventContext';
import useEventState from '../../hooks/useEventsState';
import EditorContext from '../../contexts/EditorContext';
import CanvasToolbar from '../CanvasToolbar/CanvasToolbar';
import playSvg from '../../assets/editor/play.svg';
import pauseSvg from '../../assets/editor/pause.svg';
import useContainerSize from './hooks/useContainerSize';
import usePlayerTime from './hooks/usePlayerTime';
import useSubtitles from './hooks/useSubtitles';

const Player = ({
  videoRef,
  canvas,
  setCanvas,
  isPlaying,
  words,
  currentTime,
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
  setVideoData,
  transcriptonStatus,
  setSpeakers
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [eventState, eventDispatch] = useEventState();
  const containerRef = useRef(null);
  const playClickHandler = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };
  useEffect(() => {
    if (transcriptonStatus && transcriptonStatus.isFinished) {
      videoRef.current.pause();
    }
  }, [transcriptonStatus, videoRef]);

  useContainerSize(editorState.canvasState, editorDispatch, containerRef);

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
                  {isPlaying ? (
                    <img src={pauseSvg} alt='pause' />
                  ) : (
                    <img src={playSvg} alt='play' />
                  )}
                </div>
              </div>
              <CanvasToolbar
                setVideoData={setVideoData}
                info={info}
                setSpeakers={setSpeakers}
                canvas={canvas}
              />
            </>
          ) : null}
        </div>
      </EventContext.Provider>
    </div>
  );
};

export default Player;
