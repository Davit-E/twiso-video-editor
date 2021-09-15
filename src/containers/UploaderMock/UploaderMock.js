import React, { useRef, useEffect } from 'react';
import styles from './UploaderMock.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { words } from './sampleWords/sampleWords';

const UploaderMock = ({
  setIsFinished,
  setVideoUrl,
  setDuration,
  wordsRef,
  setVideoForUpload,
  clearState,
}) => {
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
    setVideoUrl(URL.createObjectURL(uploadRef.current.files[0]));
    setDuration(175.56898);
    wordsRef.current = [...words];
    setIsFinished(true);
  };

  useEffect(() => {
    clearState();
  }, [clearState]);

  return (
    <>
      <Navbar />
      <div className={styles.UploaderMock}>
        <button
          className={styles.UploadVideo}
          onClick={() => uploadRef.current.click()}
        >
          Upload video
        </button>
        <input
          ref={uploadRef}
          type='file'
          accept='video/mp4'
          style={{ display: 'none' }}
          onChange={uploadHandler}
        />
      </div>
    </>
  );
};

export default UploaderMock;
