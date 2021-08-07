import React, { useEffect, useRef } from 'react';
import styles from './Uploader.module.css';

const Uploader = ({
  viedoForUpload,
  setVideoForUpload,
  uploadVideo,
  isUploading,
  progress,
}) => {
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    setVideoForUpload(uploadRef.current.files[0]);
  };
  
  useEffect(() => {
    if (viedoForUpload) {
      const formData = new FormData();
      formData.append('video', viedoForUpload);
      uploadVideo(formData);
    }
  }, [viedoForUpload, uploadVideo, setVideoForUpload]);

  return (
    <div className={styles.Uploader}>
      <p className={styles.UploadText}>Upload a video or audio file</p>
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
  );
};

export default Uploader;
