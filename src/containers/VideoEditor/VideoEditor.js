import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoEditor.module.css';
import Transcription from '../Transcription/Transcription';
import Player from '../Player/Player';
import Video from '../Video/Video';
import Navigation from '../Navigation/Navigation';
import useEditorState from '../../hooks/useEditorState';
import EditorContext from '../../contexts/EditorContext';
import { useHistory, useParams } from 'react-router-dom';
import useGetVideo from '../../hooks/useGetVideo';
import Spinner from '../../components/Spinner2/Spinner';
import useUpdateProject from '../../hooks/useUpdateProject';
import useDownloadVideo from '../../hooks/useDownloadVideo';

const getCanvasObject = (canvas) => {
  let jsonCanvas = canvas.toJSON([
    'id',
    'cornerRadius',
    'isSvg',
    'padding',
    'cursorWidth',
    'rx',
    'ry',
    'noScaleCache',
  ]);
  let zoom = canvas.getZoom();
  jsonCanvas.width = canvas.getWidth() / zoom;
  jsonCanvas.height = canvas.getHeight() / zoom;
  jsonCanvas.resize = canvas.resize;
  return jsonCanvas;
};

const VideoEditor = ({ speakers }) => {
  const [editorState, editorDispatch] = useEditorState();
  const { getVideo, words, info, getVideoError } = useGetVideo();
  const { isUpdatingProject, updateProject } = useUpdateProject();
  const { isDownloading, downloadVideo, downloadedVideo, setDownloadedVideo } =
    useDownloadVideo();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [nextCutIndex, setNextCutIndex] = useState(null);
  const [shouldRerenderSub, setShouldRerenderSub] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [fabricSub, setFabricSub] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [subList, setSubList] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const history = useHistory();
  const params = useParams();
  const videoRef = useRef(null);
  const wordsUpdateTimerRef = useRef(null);
  const canvasUpdateTimerRef = useRef(null);
  const isFirstLoad = useRef(true);
  const isMounted = useRef(false);

  // useEffect(() => {
  //   console.log(editorState.canvasState);
  // }, [editorState]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    if (params && params.id) getVideo(params.id);
  }, [params, getVideo]);

  useEffect(() => {
    if (getVideoError) history.push('/home');
  }, [getVideoError, history]);

  const triggerWordsUpdate = useCallback(() => {
    if (wordsUpdateTimerRef.current) clearTimeout(wordsUpdateTimerRef.current);
    let timeout = setTimeout(() => {
      if (isMounted.current) {
        wordsUpdateTimerRef.current = null;
        updateProject({
          id: info.id,
          transcription: [...words],
        });
      }
    }, 1000);
    wordsUpdateTimerRef.current = timeout;
  }, [updateProject, info, words]);

  const triggerCanvasUpdate = useCallback(() => {
    if (canvasUpdateTimerRef.current) {
      clearTimeout(canvasUpdateTimerRef.current);
    }
    let timeout = setTimeout(() => {
      if (isMounted.current) {
        canvasUpdateTimerRef.current = null;
        let jsonCanvas = getCanvasObject(canvas);
        updateProject({
          id: info.id,
          canvas: { ...jsonCanvas },
        });
      }
    }, 1000);
    canvasUpdateTimerRef.current = timeout;
  }, [updateProject, info, canvas]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else if (!isDownloading && words) triggerWordsUpdate();
  }, [videoCuts, triggerWordsUpdate, isDownloading, words]);

  useEffect(() => {
    if (editorState.shouldTriggerUpdate && !isDownloading) {
      editorDispatch({ type: 'setShouldTriggerUpdate', data: false });
      triggerCanvasUpdate();
    }
  }, [
    triggerCanvasUpdate,
    editorState.shouldTriggerUpdate,
    editorDispatch,
    isDownloading,
  ]);

  return (
    <>
      <EditorContext.Provider value={{ editorState, editorDispatch }}>
        {info ? (
          <>
            <Navigation
              canvas={canvas}
              videoRef={videoRef}
              videoCuts={videoCuts}
              duration={info ? info.duration : null}
              words={words}
              subList={subList}
              fabricSub={fabricSub}
              videoData={info}
              isUpdatingProject={isUpdatingProject}
              isDownloading={isDownloading}
              downloadVideo={downloadVideo}
              downloadedVideo={downloadedVideo}
              setDownloadedVideo={setDownloadedVideo}
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
                currentSub={currentSub}
                setCurrentSub={setCurrentSub}
                fabricSub={fabricSub}
                setShouldRerenderSub={setShouldRerenderSub}
                setCurrentTime={setCurrentTime}
                setNextCutIndex={setNextCutIndex}
                videoCuts={videoCuts}
                triggerWordsUpdate={triggerWordsUpdate}
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
                shouldRerenderSub={shouldRerenderSub}
                setShouldRerenderSub={setShouldRerenderSub}
                speakers={speakers}
                info={info}
              />
              <Video
                videoRef={videoRef}
                setIsPlaying={setIsPlaying}
                currentSelection={currentSelection}
                setCurrentSelection={setCurrentSelection}
                setCurrentTime={setCurrentTime}
                videoCuts={videoCuts}
                words={words}
                setNextCutIndex={setNextCutIndex}
                setCurrentWordIndex={setCurrentWordIndex}
                setCurrentSub={setCurrentSub}
                subList={subList}
                info={info}
              />
              {/* <div className={styles.DownloadCanvas}>
                <canvas id='downloadCanvas' />
              </div> */}
            </main>
          </>
        ) : (
          <Spinner style={{ width: '100px', height: '100px' }} />
        )}
      </EditorContext.Provider>
    </>
  );
};

export default VideoEditor;
