import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import styles from './Navigation.module.css';
import EditorContext from '../../contexts/EditorContext';
import { prepareCanvas } from './utils/prepareCanvas';
import { prepareBreaks, prepareSubs } from './utils/prepareBreaksAndSubs';
import DesignControls from './DesignControls/DesignControls';
import Navbar from '../../components/Navbar/Navbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../components/Spinner2/Spinner';

const Navigation = ({
  canvas,
  videoRef,
  videoCuts,
  duration,
  subList,
  fabricSub,
  setPreviewUrl,
  videoData,
  isUpdatingProject,
  isDownloading,
  downloadVideo,
  downloadedVideo,
  setDownloadedVideo,
  words
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [downloadData, setDownloadData] = useState(null);
  const [elements, setElements] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [breaks, setBreaks] = useState(null);
  const [subs, setSubs] = useState(null);
  const [resizeInfo, setResizeInfo] = useState(null);
  const downloadRef = useRef(null);
  const history = useHistory();
  // const uploadRef = useRef(null);

  useEffect(() => {
    if (downloadedVideo) history.push(`/preview/${videoData.id}`);
  }, [downloadedVideo, history, videoData]);

  const closeHandler = (e) => {
    setDownloadedVideo(null);
  };

  useEffect(() => {
    if (downloadData) {
      downloadVideo(downloadData);
      setDownloadData(null);
    }
  }, [downloadData, downloadVideo]);

  // const imageDownloadHandler = useCallback((elArr) => {
  //   for (let i = 0; i < elArr.length; i++) {
  //     let el = elArr[i];
  //     downloadRef.current.href = el.image;
  //     downloadRef.current.download = `design${i + 1}.png`;
  //     downloadRef.current.click();
  //   }
  //   setElements(null);
  // }, []);

  // useEffect(() => {
  //   if (elements) imageDownloadHandler(elements);
  // }, [elements, imageDownloadHandler]);

  const downloadClickHandler = () => {
    if (editorState.isCropMode) {
      editorDispatch({ type: 'setIsCropMode', data: false });
    } else if (canvas && !isDownloading && !isUpdatingProject && words) {
      videoRef.current.pause();
      prepareBreaks(videoCuts, duration, setBreaks);
      if (fabricSub && subList) {
        prepareSubs(subList, fabricSub, editorState.subtitlesState, setSubs);
      } else setSubs({ captions: [], config: {} });
      prepareCanvas(canvas, setElements, setVideoInfo);
      setResizeInfo({
        type: editorState.canvasState.resize,
        w: editorState.canvasState.videoWidth,
        h: editorState.canvasState.videoHeight,
      })
    }
  };

  // const downloadClickHandler2 = () => {
  //   setPreviewUrl(videoData.url);
  // };

  const prepareData = useCallback(
    (elementsArr, videoData, breaksData, subsData, resize, id) => {
      let elements = [...elementsArr];
      let data = {
        id,
        resize: {...resize},
        video: { ...videoData },
        elements,
        breaks: [...breaksData],
        subtitles: { ...subsData },
      };
      console.log(data);
      let jsonData = JSON.stringify(data);
      setDownloadData(jsonData);
      setElements(null);
      setResizeInfo(null);
      setBreaks(null);
      setVideoInfo(null);
      setSubs(null);
    },
    []
  );

  useEffect(() => {
    if (elements && videoInfo && breaks && subs && resizeInfo) {
      prepareData(elements, videoInfo, breaks, subs, resizeInfo, videoData.id);
    }
  }, [elements, videoInfo, prepareData, breaks, subs, videoData, resizeInfo]);

  return (
    <Navbar videoData={videoData}>
      <div className={styles.Navigation}>
        {canvas ? (
          <>
            <DesignControls canvas={canvas} words={words}/>
            {isUpdatingProject ? (
              <Spinner
                style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  marginRight: '10px',
                  position: 'absolute',
                  right: '7rem',
                }}
              />
            ) : null}
            <button
              id='downloadDesign'
              className={styles.DownloadButton}
              onClick={downloadClickHandler}
            >
              {!isDownloading ? 'Download' : 'Loading...'}
            </button>
          </>
        ) : null}

        {/* <a className={styles.DownloadLink} ref={downloadRef} href='/'>
          Download
        </a> */}
        {/* {downloadedVideo ? (
          <div className={styles.DownloadVideoContainer}>
            <h2 className={styles.Close} onClick={closeHandler}>
              Close
            </h2>
            <video
              className={styles.DownloadVideo}
              style={{
                width: canvas.getWidth(),
                height: 'auto',
              }}
              // style={{ display: 'absolute' }}
              // onPlay={() => videoRef.current.play()}
              id='video'
              preload='true'
              src={downloadedVideo}
              controls
            />
          </div>
        ) : null} */}
      </div>
    </Navbar>
  );
};

export default Navigation;
