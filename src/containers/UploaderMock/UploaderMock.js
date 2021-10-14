import React, { useRef } from 'react';
import styles from './UploaderMock.module.css';
import Navbar from '../../components/Navbar/Navbar';
import * as data from './test-data/test-short.json';

const UploaderMock = ({
  wordsRef,
  setVideoForUpload,
  setVideoData,
}) => {
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
    setVideoData({
      id: data._id,
      duration: data.duration,
      url: URL.createObjectURL(uploadRef.current.files[0]),
      title: data.title,
    });
    wordsRef.current = [...data.transcription];
  };

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
