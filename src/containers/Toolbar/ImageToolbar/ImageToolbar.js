import React, { useState, useContext } from 'react';
import styles from './ImageToolbar.module.css';
import EditorContext from '../../../contexts/EditorContext';
import replaceImage from '../../../assets/editor/replaceImage.svg';
import cornerRadius from '../../../assets/editor/cornerRadius.svg';
import cropImage from '../../../assets/editor/cropImage.svg';

const ImageToolbar = () => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [radiusInput, setRadiusInput] = useState(
    editorState.imageState.cornerRadius
  );

  const clickHandler = (e) => {
    if (e.currentTarget.id === 'replace') {
      editorDispatch({ type: 'setShouldReplaceImage', data: true });
    } else if (e.currentTarget.id === 'crop') {
      editorDispatch({ type: 'setIsCropMode', data: true });
    }
  };

  const radiusChangeHandler = (e) => {
    setRadiusInput(e.target.value);
    let val = +e.target.value;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    editorDispatch({ type: 'setImageCornerRadius', data: val });
  };

  const cropDoneHandler = () => {
    editorDispatch({ type: 'setShouldCropImage', data: true });
    editorDispatch({ type: 'setShowToolbar', data: false });
  };

  const content = (
    <>
      <div
        className={[
          styles.ReaplaceContainer,
          editorState.imageState.isSvg ? styles.BorderStyle : null,
        ].join(' ')}
        id='replace'
        onClick={clickHandler}
      >
        <img src={replaceImage} alt='replace' />
        <p>Replace</p>
      </div>

      {!editorState.imageState.isSvg ? (
        <>
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
              onChange={radiusChangeHandler}
            />
          </div>
          <div className={styles.BorderDiv}></div>
          <div
            className={styles.CropContainer}
            id='crop'
            onClick={clickHandler}
          >
            <img src={cropImage} alt='crop' />
            <p>Crop</p>
          </div>
        </>
      ) : null}
    </>
  );

  return (
    <div className={styles.ImageToolbar}>
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

export default ImageToolbar;
