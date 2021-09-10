import React, { useEffect, useState, useRef } from 'react';
import styles from './VideoEditor.module.css';
import Transcription from '../Transcription/Transcription';
import Player from '../Player/Player';
import Video from '../Video/Video';
import Navigation from '../Navigation/Navigation';
import useEditorState from '../../hooks/useEditorState';
import EditorContext from '../../contexts/EditorContext';
// import Preview from '../Preview/Preview';
import { useHistory, useRouteMatch } from 'react-router-dom';

const VideoEditor = ({
  viedoForUpload,
  videoUrl,
  words,
  videoRef,
  duration,
  clearState,
  speakers,
}) => {
  const [editorState, editorDispatch] = useEditorState();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [nextCutIndex, setNextCutIndex] = useState(null);
  const [videoSize, setVideoSize] = useState(null);
  const [shouldRerenderSub, setShouldRerenderSub] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [fabricSub, setFabricSub] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [subList, setSubList] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const match = useRouteMatch();
  const history = useHistory();
  const isPreviewRef = useRef(true);
  // useEffect(() => {
  //   return () => clearState();
  // }, [clearState]);

  // useEffect(() => {
  //   console.log('currentSub:', currentSub);
  // }, [currentSub]);

  // useEffect(() => {
  //   console.log('subList:', subList);
  // }, [subList]);

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

  useEffect(() => {
    if (isPreviewRef.current && previewUrl) {
      isPreviewRef.current = false;
      if (isPlaying && videoRef.current) videoRef.current.pause();
      // history.push(`${match.path}/preview`);
    }
  }, [previewUrl, history, match.path, isPlaying, videoRef]);

  return (
    <>
      <EditorContext.Provider value={{ editorState, editorDispatch }}>
        <Navigation
          canvas={canvas}
          videoRef={videoRef}
          videoCuts={videoCuts}
          duration={duration}
          words={words}
          subList={subList}
          fabricSub={fabricSub}
          viedoForUpload={viedoForUpload}
          setPreviewUrl={setPreviewUrl}
          previewUrl={previewUrl}
          videoUrl={videoUrl}
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
            currentSub={currentSub}
            setCurrentSub={setCurrentSub}
            fabricSub={fabricSub}
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
            subList={subList}
            setSubList={setSubList}
            fabricSub={fabricSub}
            setFabricSub={setFabricSub}
            currentSub={currentSub}
            setCurrentSub={setCurrentSub}
            videoSize={videoSize}
            shouldRerenderSub={shouldRerenderSub}
            setShouldRerenderSub={setShouldRerenderSub}
            speakers={speakers}
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
            setCurrentSub={setCurrentSub}
            subList={subList}
          />
          {/* <div className={styles.DownloadCanvas}>
          <canvas id='downloadCanvas' />
        </div> */}
        </main>
        {/* {previewUrl ? (
          <Preview
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            words={words}
          />
        ) : null} */}
        {/* <Route
          path={`${match.path}/preview`}
          component={() => <Preview previewUrl={previewUrl} words={words} />}
        /> */}
      </EditorContext.Provider>
    </>
  );
};

export default VideoEditor;
