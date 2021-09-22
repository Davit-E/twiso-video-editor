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
  setVideoData,
}) => {
  const [videoDuration, setVideoDuration] = useState(0);
  const { isUploading, uploadVideo, info, uploadProgress } = useUploadVideo();

  useEffect(() => {
    if (info) setVideoData(info);
  }, [info, setVideoData]);

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
            info={info}
            setIsFinished={setIsFinished}
          />
        )}
      </div>
    </>
  );
};

export default Uploader;
