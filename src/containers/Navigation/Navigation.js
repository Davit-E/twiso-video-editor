/* eslint-disable jsx-a11y/img-redundant-alt */
import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import styles from './Navigation.module.css';
import backArrow from '../../assets/backArrow.svg';
import addText from '../../assets/addText.svg';
import addImage from '../../assets/addImage.svg';
import addShape from '../../assets/addShape.svg';
import subtitles from '../../assets/subtitles.svg';
import AppContext from '../../contexts/AppContext';
import photo from '../../assets/photo.jpg';
import photo2 from '../../assets/photo2.jpg';
import Backdrop from '../../components/Backdrop/Backdrop';
import ImageDropdown from './ImageDropdown/ImageDropdown';
import ShapeDropdown from './ShapeDropdown/ShapeDropdown';
import SubtitlesDropdown from './SubtitlesDropdown/SubtitlesDropdown';
import { downloadStartHandler } from './utils/download';
import useDownloadVideo from '../../hooks/useDownloadVideo';

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
  const { appState, appDispatch } = useContext(AppContext);
  const { isDownloading, downloadVideo, downloadedVideo } = useDownloadVideo();
  const [downloadData, setDownloadData] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [breaks, setBreaks] = useState(null);
  const [userFiles, setUserFiles] = useState([
    { src: photo, type: 'image' },
    { src: photo2, type: 'image' },
  ]);

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

  const clickHandler = (e) => {
    if (canvas && !appState.shouldCropImage) {
      let type = '';
      let id = e.currentTarget.id;
      if (id === 'addText') type = 'setShouldAddText';
      else if (id === 'addImage') type = 'setIsImageDropdown';
      else if (id === 'addShape') type = 'setIsShapeDropdown';
      else if (id === 'subtitles') type = 'setIsSubtitlesDropdown';
      appDispatch({ type, data: true });
      if (appState.isCropMode) {
        appDispatch({ type: 'setIsCropMode', data: false });
      }
    }
  };

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
    if (appState.isCropMode) {
      appDispatch({ type: 'setIsCropMode', data: false });
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
    let videoBreaks = [];
    let prev = null;
    for (let i = 0; i < cuts.length; i++) {
      let el = cuts[i];
      if (i === 0) {
        videoBreaks.push({ start: 0, end: el.start });
        prev = el.end;
      } else {
        videoBreaks.push({ start: prev, end: el.start });
        prev = el.end;
      }

      if (i === cuts.length - 1 && el.end !== endTime) {
        videoBreaks.push({ start: el.end, end: endTime });
      }
    }
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
      console.log(jsonData);
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
        <button
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
        />
      </div>

      <div className={styles.ControlsContainer}>
        <div
          className={styles.AddTextContainer}
          id='addText'
          onClick={clickHandler}
        >
          <img src={addText} alt='add text' />
          <div className={styles.HoverContent}>
            <div className={styles.HoverTriangle}></div>
            <p className={styles.HoverText}>Add text</p>
          </div>
        </div>
        <div className={styles.DesignControl}>
          <div
            className={styles.AddImageContainer}
            id='addImage'
            onClick={clickHandler}
          >
            <img src={addImage} alt='add image' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Add image</p>
            </div>
          </div>
          {appState.isImageDropdown ||
          appState.shouldReplaceImage ||
          appState.shouldAddCanvasBgImage ? (
            <>
              <Backdrop />
              <div className={styles.ImageDropdown}>
                <ImageDropdown
                  userFiles={userFiles}
                  setUserFiles={setUserFiles}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className={styles.DesignControl}>
          <div
            className={styles.AddShapeContainer}
            id='addShape'
            onClick={clickHandler}
          >
            <img src={addShape} alt='add shape' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Add shape</p>
            </div>
          </div>
          {appState.isShapeDropdown ? (
            <>
              <Backdrop />
              <div className={styles.ShapeDropdown}>
                <ShapeDropdown />
              </div>
            </>
          ) : null}
        </div>
        <div className={styles.DesignControl}>
          <div
            className={styles.AddShapeContainer}
            id='subtitles'
            onClick={clickHandler}
          >
            <img src={subtitles} alt='subtitles' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Subtitles</p>
            </div>
          </div>
        </div>
        {appState.isSubtitlesDropdown ? (
          <>
            <Backdrop />
            <div className={styles.SubtitlesDropdown}>
              <SubtitlesDropdown />
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.DownloadUserInfoContainer}>
        <button
          id='downloadDesign'
          className={styles.DownloadButton}
          // onClick={downloadClickHandler}
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
    </header>
  );
};

export default Navigation;
