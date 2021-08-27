import React, { useState, useEffect } from 'react';
import styles from './Uploader.module.css';
import DragDrop from './DragDrop/DragDrop';
import UploadProgress from './UploadProgress/UploadProgress';
import useUploadVideo from '../../hooks/useUploadVideo';
import Navbar from '../../components/Navbar/Navbar';

const Uploader = ({
  viedoForUpload,
  setVideoForUpload,
  setIsFinished,
  setVideoUrl,
  setDuration,
  wordsRef,
}) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const {
    isUploading,
    uploadVideo,
    words,
    videoUrl,
    duration,
    uploadProgress,
  } = useUploadVideo();

  useEffect(() => {
    if (duration && videoUrl && words) {
      setVideoUrl(videoUrl);
      setDuration(duration);
      wordsRef.current = [...words];
    }
  }, [words, duration, setVideoUrl, setDuration, wordsRef, videoUrl]);

  useEffect(() => {
    if (viedoForUpload) {
      const formData = new FormData();
      formData.append('video', viedoForUpload);
      uploadVideo(formData);
    }
  }, [viedoForUpload, uploadVideo]);

  return (
    <>
      <Navbar />
      <div className={styles.Uploader}>
        {!viedoForUpload ? (
          <DragDrop
            setVideoForUpload={setVideoForUpload}
            setVideoDuration={setVideoDuration}
          />
        ) : (
          <UploadProgress
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            videoDuration={videoDuration}
            videoUrl={videoUrl}
            setIsFinished={setIsFinished}
          />
        )}
      </div>
    </>
  );
};

export default Uploader;
