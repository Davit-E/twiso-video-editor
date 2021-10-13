import React from 'react';
import styles from './UploadProgress.module.css';

const UploadProgress = ({ uploadProgress }) => {
  return (
    <div className={styles.UploadProgress}>
      <p className={styles.Percentage}>{uploadProgress}%</p>
      <p className={styles.Heading}>Uploading your video</p>
      <div className={styles.ProgressBar}>
        <div
          className={styles.ProgressBarInner}
          style={{
            maxWidth: uploadProgress + '%',
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
