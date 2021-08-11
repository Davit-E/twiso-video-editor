import React, { useState, useEffect, useCallback } from 'react';
import styles from './UploadProgress.module.css';

const UploadProgress = ({
  uploadProgress,
  isUploading,
  videoDuration,
  videoUrl,
  setIsFinished,
}) => {
  // console.log(videoDuration);
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const uploadMaxPercentage = 40;

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const progressHandler = useCallback(() => {
    let intervalTime = (videoDuration * 1000) / (100 - uploadMaxPercentage) / 2;
    // console.log(intervalTime);
    let interval = setInterval(() => {
      setProgress((prevState) => {
        if (prevState >= 99) {
          clearInterval(interval);
          return 99;
        } else return prevState + 0.5;
      });
    }, intervalTime);
    setIntervalId(interval);
  }, [videoDuration]);

  useEffect(() => {
    let interval = null;
    if (videoUrl) {
      clearInterval(intervalId);
      let interval = setInterval(() => {
        setProgress((prevState) => {
          if (prevState >= 100) {
            clearInterval(interval);
            return 100;
          } else return prevState + 1;
        });
      }, 100);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [videoUrl, intervalId]);

  useEffect(() => {
    let timeout = null;
    if (progress === 100 && videoUrl) {
      timeout =  setTimeout(() => setIsFinished(true), 1000);
    }

    return () => {
      if (timeout !== null) clearTimeout(timeout);
    };
  }, [progress, videoUrl, setIsFinished]);

  useEffect(() => {
    if (uploadProgress === 100 && !isUploading) progressHandler();
    // progressHandler();
  }, [uploadProgress, progressHandler, isUploading]);

  useEffect(() => {
    if (isUploading) {
      setProgress(Math.round(uploadProgress * (uploadMaxPercentage / 100)));
    }
  }, [isUploading, uploadProgress]);

  return (
    <div className={styles.UploadProgress}>
      <p className={styles.Percentage}>{Math.floor(progress)}%</p>
      <p className={styles.Heading}>Transcribing your video</p>
      <div className={styles.ProgressBar}>
        <div
          className={styles.ProgressBarInner}
          style={{
            maxWidth: progress + '%',
          }}
        ></div>
      </div>
      <p className={styles.Subheading}>
        Please be patient. It may take several minutes.
      </p>
    </div>
  );
};

export default UploadProgress;
