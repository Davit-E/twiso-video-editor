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
import useDownloadVideo from '../../hooks/useDownloadVideo';
import DesignControls from './DesignControls/DesignControls';
import Navbar from '../../components/Navbar/Navbar';

const Navigation = ({
  canvas,
  videoRef,
  videoCuts,
  duration,
  subArr,
  currentSub,
  viedoForUpload,
  setPreviewUrl,
  videoUrl
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const { isDownloading, downloadVideo, downloadedVideo, setDownloadedVideo } =
    useDownloadVideo();
  const [downloadData, setDownloadData] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [breaks, setBreaks] = useState(null);
  const [subs, setSubs] = useState(null);
  const downloadRef = useRef(null);
  const isMounted = useRef(false);
  // const uploadRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    if (downloadedVideo) {
      setPreviewUrl(downloadedVideo);
    }
  }, [downloadedVideo, setPreviewUrl]);

  const closeHandler = (e) => {
    setDownloadedVideo(null);
  };

  useEffect(() => {
    if (downloadData) {
      downloadVideo(downloadData);
      setDownloadData(null);
    }
  }, [downloadData, downloadVideo]);

  // const imageDownloadHandler = useCallback((back, front) => {
  //   downloadRef.current.href = back;
  //   downloadRef.current.download = 'design.png';
  //   downloadRef.current.click();
  //   if (front) {
  //     downloadRef.current.href = front;
  //     downloadRef.current.download = 'design2.png';
  //     downloadRef.current.click();
  //     setBackImage(null);
  //     setFrontImage(null);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (backImage && frontImage !== null) {
  //     imageDownloadHandler(backImage, frontImage);
  //   }
  // }, [backImage, frontImage, imageDownloadHandler]);

  const downloadClickHandler = () => {
    if (editorState.isCropMode) {
      editorDispatch({ type: 'setIsCropMode', data: false });
    } else if (canvas) {
      videoRef.current.pause();
      prepareBreaks(videoCuts, duration, setBreaks);
      if (currentSub && subArr) {
        prepareSubs(subArr, currentSub, editorState.subtitlesState, setSubs);
      } else setSubs({ captions: [], config: {} });
      prepareCanvas(
        canvas,
        setBackImage,
        setFrontImage,
        setVideoInfo,
        viedoForUpload,
        isMounted
      );
    }
  };

  // const downloadClickHandler2 = () => {
  //   setPreviewUrl(videoUrl);
  // };

  const prepareData = useCallback(
    (backImg, frontImg, videoData, breaksData, subsData) => {
      let elements = [{ ...backImg }];
      if (frontImg) elements.push({ ...frontImg });
      let data = {
        video: { ...videoData },
        elements,
        breaks: [...breaksData],
        subtitles: { ...subsData },
      };
      console.log(data);
      let jsonData = JSON.stringify(data);
      console.log(jsonData);
      setDownloadData(jsonData);
      setBackImage(null);
      setFrontImage(null);
      setBreaks(null);
      setVideoInfo(null);
      setSubs(null);
    },
    []
  );

  useEffect(() => {
    if (backImage && frontImage !== null && videoInfo && breaks && subs) {
      prepareData(backImage, frontImage, videoInfo, breaks, subs);
    }
  }, [backImage, frontImage, videoInfo, prepareData, breaks, subs]);

  return (
    <Navbar>
      <div className={styles.Navigation}>
        {canvas ? (
          <>
            <DesignControls canvas={canvas} />
            <button
              id='downloadDesign'
              className={styles.DownloadButton}
              onClick={downloadClickHandler}
            >
              {!isDownloading ? 'Download' : 'Loading...'}
            </button>
          </>
        ) : null}

        <a className={styles.DownloadLink} ref={downloadRef} href='/'>
          Download
        </a>
        {downloadedVideo ? (
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
        ) : null}
      </div>
    </Navbar>
  );
};

export default Navigation;
