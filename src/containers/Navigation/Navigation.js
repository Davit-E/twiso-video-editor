/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useRef, useState, useContext } from 'react';
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

const Navigation = ({ setVideoForUpload, isUploading, canvas }) => {
  const { appState, appDispatch } = useContext(AppContext);
  const [userFiles, setUserFiles] = useState([
    { src: photo, type: 'image' },
    { src: photo2, type: 'image' },
  ]);

  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
  };

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
          {!isUploading ? ' Upload video' : 'Loading...'}
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
        <button id='downloadDesign' className={styles.DownloadButton}>
          Download
        </button>
        <div className={styles.User}>
          <p className={styles.UserInitials}>DE</p>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
