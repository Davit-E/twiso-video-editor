import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import styles from './Navigation.module.css';
import backArrow from '../../assets/backArrow.svg';
import EditorContext from '../../contexts/EditorContext';
import { downloadStartHandler } from './utils/download';
import useDownloadVideo from '../../hooks/useDownloadVideo';
import DesignControls from './DesignControls/DesignControls';

const handleDownload = async (data, download, setData) => {
  try {
    await download(data);
  } catch (err) {
    console.log(err);
  } finally {
    setData(null);
  }
};

const Navigation = ({
  viedoForUpload,
  setVideoForUpload,
  isUploading,
  canvas,
  videoRef,
  videoCuts,
  duration,
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const { isDownloading, downloadVideo, downloadedVideo } = useDownloadVideo();
  const [downloadData, setDownloadData] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [breaks, setBreaks] = useState(null);
  const uploadRef = useRef(null);
  const downloadRef = useRef(null);

  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
  };

  useEffect(() => {
    if (downloadData) {
      handleDownload(downloadData, downloadVideo, setDownloadData);
    }
  }, [downloadData, downloadVideo]);

  const imageDownloadHandler = useCallback((back, front) => {
    downloadRef.current.href = back;
    downloadRef.current.download = 'design.png';
    downloadRef.current.click();
    if (front) {
      downloadRef.current.href = front;
      downloadRef.current.download = 'design2.png';
      downloadRef.current.click();
      setBackImage(null);
      setFrontImage(null);
    }
  }, []);

  const downloadClickHandler = () => {
    if (editorState.isCropMode) {
      editorDispatch({ type: 'setIsCropMode', data: false });
    } else if (canvas) {
      videoRef.current.pause();
      generateBreaks(videoCuts, duration);
      downloadStartHandler(
        canvas,
        setBackImage,
        setFrontImage,
        setVideoInfo,
        viedoForUpload
      );
    }
  };

  // useEffect(() => {
  //   if (backImage && frontImage !== null) {
  //     imageDownloadHandler(backImage, frontImage);
  //   }
  // }, [backImage, frontImage, imageDownloadHandler]);

  const generateBreaks = (cuts, endTime) => {
    console.log(cuts);
    let videoBreaks = [];
    let prev = null;
    for (let i = 0; i < cuts.length; i++) {
      let el = cuts[i];
      if (i === 0 && el.start !== 0) {
        videoBreaks.push({ start: 0, end: el.start });
      } else if (el.start !== 0) {
        videoBreaks.push({ start: prev, end: el.start });
      }
      prev = el.end;

      if (i === cuts.length - 1 && el.end !== endTime) {
        videoBreaks.push({ start: el.end, end: endTime });
      }
    }
    console.log(videoBreaks);
    setBreaks(videoBreaks);
  };

  const prepareData = useCallback(
    (backImg, frontImg, videoData, breaksData) => {
      let elements = [{ ...backImg }];
      if (frontImg) elements.push({ ...frontImg });
      let data = {
        video: { ...videoData },
        elements,
        breaks: [...breaksData],
      };
      console.log(data);
      let jsonData = JSON.stringify(data);
      // console.log(jsonData);
      setDownloadData(jsonData);
      setBackImage(null);
      setFrontImage(null);
      setBreaks(null);
      setVideoInfo(null);
    },
    []
  );

  useEffect(() => {
    if (backImage && frontImage !== null && videoInfo && breaks) {
      prepareData(backImage, frontImage, videoInfo, breaks);
    }
  }, [backImage, frontImage, videoInfo, prepareData, breaks]);

  return (
    <header className={styles.Navigation}>
      <div className={styles.BackFileInfoContainer}>
        <img className={styles.BackArrow} src={backArrow} alt='back' />
        <div className={styles.FileInfoContainer}>
          <p className={styles.FileName}>Untitled</p>
          <p className={styles.Creater}>Dmitry</p>
        </div>

        {/* <button
          className={styles.UploadVideo}
          onClick={() => uploadRef.current.click()}
        >
          {!isUploading ? 'Upload video' : 'Loading...'}
        </button>
        <input
          ref={uploadRef}
          type='file'
          accept='video/mp4'
          style={{ display: 'none' }}
          onChange={uploadHandler}
        /> */}

      </div>
      {duration ? <DesignControls canvas={canvas} /> : null}
      <div className={styles.DownloadUserInfoContainer}>
        <button
          id='downloadDesign'
          className={styles.DownloadButton}
          onClick={downloadClickHandler}
        >
          {!isDownloading ? 'Download' : 'Loading...'}
        </button>
        <div className={styles.User}>
          <p className={styles.UserInitials}>DE</p>
        </div>
      </div>
      <a className={styles.DownloadLink} ref={downloadRef} href='/'>
        Download
      </a>
      {downloadedVideo ? (
        <div className={styles.DownloadVideoContainer}>
          <video
            className={styles.DownloadVideo}
            // style={{ display: 'absolute' }}
            // onPlay={() => videoRef.current.play()}
            id='video'
            preload='true'
            src={downloadedVideo}
            controls
          />
        </div>
      ) : null}
    </header>
  );
};

export default Navigation;
