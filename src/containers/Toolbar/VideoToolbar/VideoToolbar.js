import React, { useState, useContext } from 'react';
import styles from './VideoToolbar.module.css';
import EditorContext from '../../../contexts/EditorContext';
import cornerRadius from '../../../assets/editor/cornerRadius.svg';
import cropImage from '../../../assets/editor/cropImage.svg';

const VideoToolbar = () => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [radiusInput, setRadiusInput] = useState(
    editorState.videoState.cornerRadius
  );

  const clickHandler = (e) => {
    if (e.currentTarget.id === 'crop') {
      editorDispatch({ type: 'setIsCropMode', data: true });
    }
  };

  const radiusChangeHandler = (e) => {
    setRadiusInput(e.target.value);
  };

  const radiusOnBlur = (e) => {
    let val = +e.target.value;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    editorDispatch({ type: 'setVideoCornerRadius', data: val });
  };

  const cropDoneHandler = () => {
    editorDispatch({ type: 'setShouldCropImage', data: true });
    editorDispatch({ type: 'setShowToolbar', data: false });
  };

  const content = (
    <>
      <div className={styles.CropContainer} id='crop' onClick={clickHandler}>
        <img src={cropImage} alt='replace' />
        <p>Crop</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div
        className={styles.RadiusContainer}
        id='radius'
        onClick={clickHandler}
      >
        <img src={cornerRadius} alt='radius' />
        <input
          className={styles.RadiusInput}
          type='number'
          value={radiusInput}
          onBlur={radiusOnBlur}
          onChange={radiusChangeHandler}
        />
      </div>
    </>
  );

  return (
    <div className={styles.VideoToolbar}>
      {!editorState.isCropMode ? (
        content
      ) : (
        <div className={styles.DoneContainer} onClick={cropDoneHandler}>
          Done
        </div>
      )}
    </div>
  );
};

export default VideoToolbar;
