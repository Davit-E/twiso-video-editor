import React, { useEffect, useRef, useCallback } from 'react';
import styles from './DragDrop.module.css';
import upload from '../../../assets/editor/upload.svg';

const DragDrop = ({ setVideoForUpload, setVideoDuration }) => {
  const uploadRef = useRef(null);
  const dropAreaRef = useRef(null);
  // const uploadHandler = () => {
  //   setVideoForUpload(uploadRef.current.files[0]);
  // };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropAreaRef.current.classList.add(styles.Active);
    return false;
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current.classList.add(styles.Active);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaRef.current.classList.remove(styles.Active);
  }, []);

  const validateFile = useCallback(
    (file) => {
      if (file.type === 'video/mp4') {
        let video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          if (video.duration > 1) {
            setVideoDuration(video.duration);
            setVideoForUpload(file);
          }
          return;
        };
        video.src = URL.createObjectURL(file);
      }
    },
    [setVideoDuration, setVideoForUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropAreaRef.current.classList.remove(styles.Active);
      let file = e.dataTransfer.files[0];
      validateFile(file);
      return false;
    },
    [validateFile]
  );

  useEffect(() => {
    let area = dropAreaRef.current;
    area.addEventListener('dragover', handleDragOver, false);
    area.addEventListener('dragenter', handleDragEnter, false);
    area.addEventListener('dragleave', handleDragLeave, false);
    area.addEventListener('drop', handleDrop, false);

    return () => {
      area.removeEventListener('dragover', handleDragOver, false);
      area.removeEventListener('dragenter', handleDragEnter, false);
      area.removeEventListener('dragleave', handleDragLeave, false);
      area.removeEventListener('drop', handleDrop, false);
    };
  }, [handleDragOver, handleDrop, handleDragEnter, handleDragLeave]);

  return (
    <div className={styles.DragDrop}>
      <p className={styles.UploadText}>Upload a video or audio file</p>
      <div
        ref={dropAreaRef}
        className={styles.DropArea}
        onClick={() => uploadRef.current.click()}
      >
        <div className={styles.DropAreaContent}>
          <img src={upload} alt='upload' />
          <div className={styles.DropAreaText}>
            <p className={styles.DropAreaHeading}>Drag & drop your file here</p>
            <p className={styles.DropAreaSubheading}>
              or click to <span className={styles.DropAreaBrowse}>browse</span>
            </p>
          </div>
        </div>
      </div>
      <input
        ref={uploadRef}
        type='file'
        accept='video/mp4'
        style={{ display: 'none' }}
        onChange={() => validateFile(uploadRef.current.files[0])}
      />
    </div>
  );
};

export default DragDrop;
