/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useRef } from 'react';
import styles from './Navigation.module.css';
import backArrow from '../../assets/backArrow.svg';
import addText from '../../assets/addText.svg';
import addImage from '../../assets/addImage.svg';
import addShape from '../../assets/addShape.svg';
import subtitles from '../../assets/subtitles.svg';

const Navigation = ({ setVideoForUpload, isUploading }) => {
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
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
        <div className={styles.AddTextContainer} id='addText'>
          <img src={addText} alt='add text' />
          <div className={styles.HoverContent}>
            <div className={styles.HoverTriangle}></div>
            <p className={styles.HoverText}>Add text</p>
          </div>
        </div>
        <div className={styles.DesignControl}>
          <div className={styles.AddImageContainer} id='addImage'>
            <img src={addImage} alt='add image' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Add image</p>
            </div>
          </div>
        </div>

        <div className={styles.DesignControl}>
          <div id='addShape' className={styles.AddShapeContainer}>
            <img src={addShape} alt='add shape' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Add shape</p>
            </div>
          </div>
        </div>
        <div className={styles.DesignControl}>
          <div id='subtitles' className={styles.AddShapeContainer}>
            <img src={subtitles} alt='subtitles' />
            <div className={styles.HoverContent}>
              <div className={styles.HoverTriangle}></div>
              <p className={styles.HoverText}>Subtitles</p>
            </div>
          </div>
        </div>
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
