import React, { useRef, useEffect } from 'react';
import styles from './UploaderMock.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { words } from './sampleWords/sampleWords2';

const UploaderMock = ({
  setIsFinished,
  wordsRef,
  setVideoForUpload,
  clearState,
  setVideoData
}) => {
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
    setVideoData({
      id: '1',
      duration: 175.56898,
      url: URL.createObjectURL(uploadRef.current.files[0]),
      title: 'Untitled'
    })
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
