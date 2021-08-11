import React, { useEffect, useState } from 'react';
import styles from './VideoEditor.module.css';
import Transcription from '../Transcription/Transcription';
import Player from '../Player/Player';
import Video from '../Video/Video';
import Navigation from '../Navigation/Navigation';
import useEditorState from '../../hooks/useEditorState';
import EditorContext from '../../contexts/EditorContext';

const VideoEditor = ({
  canvas,
  setCanvas,
  subArr,
  setSubArr,
  currentSub,
  setCurrentSub,
  videoCuts,
  setVideoCuts,
  viedoForUpload,
  videoUrl,
  words,
  videoRef,
  duration,
  setVideoForUpload,
  clearState
}) => {
  const [editorState, editorDispatch] = useEditorState();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [nextCutIndex, setNextCutIndex] = useState(null);
  const [currentSubIndex, setCurrentSubIndex] = useState(null);
  const [videoSize, setVideoSize] = useState(null);
  const [shouldRerenderSub, setShouldRerenderSub] = useState(false);

  useEffect(() => {
    return () => clearState();
  }, [clearState]);

  // useEffect(() => {
  //   console.log('currentSubIndex:', currentSubIndex);
  // }, [currentSubIndex]);

  // useEffect(() => {
  //   console.log(nextCutIndex);
  // }, [nextCutIndex]);

  // useEffect(() => {
  //   console.log(currentWordIndex);
  // }, [currentWordIndex]);

  // useEffect(() => {
  //   videoCuts.forEach((el) => {
  //     console.log(el);
  //   });
  // }, [videoCuts]);

  useEffect(() => {
    if (videoUrl) videoRef.current.src = videoUrl;
  }, [videoUrl, videoRef]);

  // useEffect(() => {
  //   if (viedoForUpload)
  //     videoRef.current.src = URL.createObjectURL(viedoForUpload);
  // }, [viedoForUpload, videoRef]);

  const setPlayerTime = (wordIndex) => {
    let endTime = '0';
    if (wordIndex !== null) {
      let word = words[wordIndex];
      endTime = word.end;
      videoRef.current.currentTime = +word.start;
      setCurrentTime(+word.start);
      // console.log('seting player time: ', +word.start);
    }
    let cutIndex = 0;
    for (let i = 0; i < videoCuts.length; i++) {
      let cut = videoCuts[i];
      if (+endTime > +cut.end) {
        cutIndex++;
      }
    }
    setNextCutIndex(cutIndex);
  };

  return (
    <>
      <EditorContext.Provider value={{ editorState, editorDispatch }}>
        <Navigation
          viedoForUpload={viedoForUpload}
          setVideoForUpload={setVideoForUpload}
          canvas={canvas}
          videoRef={videoRef}
          videoCuts={videoCuts}
          duration={duration}
          words={words}
          subArr={subArr}
          currentSub={currentSub}
        />
        <main className={styles.Main}>
          <Transcription
            className={styles.VideoEditor}
            words={words}
            currentWordIndex={currentWordIndex}
            setCurrentWordIndex={setCurrentWordIndex}
            isPlaying={isPlaying}
            videoRef={videoRef}
            setCuts={setVideoCuts}
            currentSelection={currentSelection}
            setCurrentSelection={setCurrentSelection}
            setPlayerTime={setPlayerTime}
            subArr={subArr}
            setCurrentSubIndex={setCurrentSubIndex}
            currentSub={currentSub}
            currentSubIndex={currentSubIndex}
            setShouldRerenderSub={setShouldRerenderSub}
          />
          <Player
            videoRef={videoRef}
            canvas={canvas}
            setCanvas={setCanvas}
            isPlaying={isPlaying}
            words={words}
            currentTime={currentTime}
            videoCuts={videoCuts}
            setNextCutIndex={setNextCutIndex}
            setCurrentWordIndex={setCurrentWordIndex}
            nextCutIndex={nextCutIndex}
            currentWordIndex={currentWordIndex}
            subArr={subArr}
            setSubArr={setSubArr}
            currentSub={currentSub}
            setCurrentSub={setCurrentSub}
            currentSubIndex={currentSubIndex}
            setCurrentSubIndex={setCurrentSubIndex}
            videoSize={videoSize}
            shouldRerenderSub={shouldRerenderSub}
            setShouldRerenderSub={setShouldRerenderSub}
          />
          <Video
            videoRef={videoRef}
            setIsPlaying={setIsPlaying}
            currentSelection={currentSelection}
            setCurrentSelection={setCurrentSelection}
            setCurrentTime={setCurrentTime}
            videoSize={videoSize}
            videoCuts={videoCuts}
            words={words}
            setVideoSize={setVideoSize}
            setNextCutIndex={setNextCutIndex}
            setCurrentWordIndex={setCurrentWordIndex}
            setCurrentSubIndex={setCurrentSubIndex}
            subArr={subArr}
          />
          {/* <div className={styles.DownloadCanvas}>
          <canvas id='downloadCanvas' />
        </div> */}
        </main>
      </EditorContext.Provider>
    </>
  );
};

export default VideoEditor;
