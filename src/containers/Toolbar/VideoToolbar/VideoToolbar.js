import React, { useState, useContext, useRef, useEffect } from 'react';
import styles from './VideoToolbar.module.css';
import EditorContext from '../../../contexts/EditorContext';
import cornerRadius from '../../../assets/editor/cornerRadius.svg';
import cropImage from '../../../assets/editor/cropImage.svg';
import downArrow from '../../../assets/editor/downArrow.svg';
import {
  strokeWidthChangeHandler,
  handleClick,
  initialLoadHandler,
  strokeChangeCompleteHandler
} from './utils/handlers';
import VideoDropdowns from './VideoDropdowns/VideoDropdowns';

const VideoToolbar = ({ coords }) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [radiusInput, setRadiusInput] = useState(
    editorState.videoState.cornerRadius
  );
  const [stroke, setStroke] = useState('rgba(255,255,255,1)');
  const [isStrokeDropdown, setIsStrokeDropdown] = useState(false);
  const [isStrokeWidthDropdown, setIsStrokeWidthDropdown] = useState(false);
  const [strokeWidthInput, setStrokeWidthInput] = useState(
    editorState.videoState.strokeWidth
  );
  const strokeRef = useRef(null);
  const strokeContainerRef = useRef(null);
  const videoToolbarRef = useRef(null);

  const clickHandler = (e) => {
    let id = e.currentTarget.id;
    if (id === 'crop') editorDispatch({ type: 'setCropType', data: 'rect' });
    else if (id === 'circleCrop') {
      editorDispatch({ type: 'setCropType', data: 'circle' });
    }
    handleClick(id, setIsStrokeDropdown, setIsStrokeWidthDropdown);
  };

  const radiusChangeHandler = (e) => {
    setRadiusInput(e.target.value);
    let val = +e.target.value;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    editorDispatch({ type: 'setVideoCornerRadius', data: val });
  };

  const cropDoneHandler = () => {
    editorDispatch({ type: 'setShouldCropMedia', data: true });
    editorDispatch({ type: 'setShowToolbar', data: false });
  };

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      initialLoadHandler(editorState.videoState, setStroke, strokeRef);
    }
  }, [editorState.videoState, isFirstLoad]);

  const content = (
    <>
      <div className={styles.CropContainer} id='crop' onClick={clickHandler}>
        <img src={cropImage} alt='replace' />
        <p>Crop</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div
        className={styles.CircleCropContainer}
        id='circleCrop'
        onClick={clickHandler}
      >
        <div className={styles.CircleCropCircle}></div>
        <p>Circle crop</p>
      </div>
      <div className={styles.BorderDiv}></div>

      <div
        ref={strokeContainerRef}
        className={styles.StrokeContainer}
        id='stroke'
        onClick={clickHandler}
      >
        <div className={styles.ColorPickerBorder}>
          <div ref={strokeRef} className={styles.ColorPicker}></div>
        </div>
        <p>Stroke</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div className={styles.StrokeWidthContainer}>
        <div className={styles.StrokeWidthInputContainer}>
          <input
            className={styles.StrokeWidthInput}
            type='number'
            value={strokeWidthInput}
            onChange={(e) =>
              strokeWidthChangeHandler(e, editorDispatch, setStrokeWidthInput)
            }
          />
        </div>
        <div
          className={styles.StrokeWidthArrowContainer}
          id='strokeWidth'
          onClick={clickHandler}
        >
          <img className={styles.DownArrow} src={downArrow} alt='arrow' />
        </div>
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
          onChange={radiusChangeHandler}
        />
      </div>

      <VideoDropdowns
        state={editorState}
        dispatch={editorDispatch}
        coords={coords}
        videoToolbar={videoToolbarRef.current}
        isStrokeWidthDropdown={isStrokeWidthDropdown}
        setIsStrokeWidthDropdown={setIsStrokeWidthDropdown}
        isStrokeDropdown={isStrokeDropdown}
        stroke={stroke}
        setStroke={setStroke}
        strokeChangeCompleteHandler={strokeChangeCompleteHandler}
        strokeRef={strokeRef}
      />
    </>
  );

  return (
    <div className={styles.VideoToolbar} ref={videoToolbarRef}>
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
