/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from './DesignControls.module.css';
import EditorContext from '../../../contexts/EditorContext';
import Backdrop from '../../../components/Backdrop/Backdrop';
import ImageDropdown from '../ImageDropdown/ImageDropdown';
import ShapeDropdown from '../ShapeDropdown/ShapeDropdown';
import SubtitlesDropdown from '../SubtitlesDropdown/SubtitlesDropdown';
import addText from '../../../assets/editor/addText.svg';
import addImage from '../../../assets/editor/addImage.svg';
import addShape from '../../../assets/editor/addShape.svg';
import subtitles from '../../../assets/editor/subtitles.svg';
import useGetAssets from '../../../hooks/useGetAssets';

const DesignControls = ({ canvas, words }) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const { getAssets, assets, setAssets } = useGetAssets();
  const [shouldFetchAssets, setShouldFetchAssets] = useState(false);
  const isFirstMount = useRef(true);

  const clickHandler = (e) => {
    if (canvas && !editorState.shouldCropMedia) {
      let type = '';
      let id = e.currentTarget.id;
      if (id === 'addText') type = 'setShouldAddText';
      else if (id === 'addImage') type = 'setIsImageDropdown';
      else if (id === 'addShape') type = 'setIsShapeDropdown';
      else if (id === 'subtitles') type = 'setIsSubtitlesDropdown';
      editorDispatch({ type, data: true });
      if (editorState.isCropMode) {
        editorDispatch({ type: 'setIsCropMode', data: false });
      }
    }
  };

  useEffect(() => {
    if (shouldFetchAssets) {
      setShouldFetchAssets(false);
      getAssets();
    }
  }, [shouldFetchAssets, getAssets]);

  return (
    <div className={styles.ControlsContainer}>
      <div
        className={styles.AddTextContainer}
        id='addText'
        onClick={clickHandler}
      >
        <img src={addText} alt='add text' />
        <div className={styles.HoverContent}>
          <div className={styles.HoverTriangle}></div>
          <p className={styles.HoverText}>Add text</p>
        </div>
      </div>
      <div className={styles.DesignControl}>
        <div
          className={styles.AddImageContainer}
          id='addImage'
          onClick={clickHandler}
        >
          <img src={addImage} alt='add image' />
          <div className={styles.HoverContent}>
            <div className={styles.HoverTriangle}></div>
            <p className={styles.HoverText}>Add image</p>
          </div>
        </div>
        {editorState.isImageDropdown ||
        editorState.shouldReplaceImage ||
        editorState.shouldAddCanvasBgImage ? (
          <>
            <Backdrop />
            <div className={styles.ImageDropdown}>
              <ImageDropdown
                assets={assets}
                setShouldFetch={setShouldFetchAssets}
                isFirstMount={isFirstMount}
                setAssets={setAssets}
              />
            </div>
          </>
        ) : null}
      </div>

      <div className={styles.DesignControl}>
        <div
          className={styles.AddShapeContainer}
          id='addShape'
          onClick={clickHandler}
        >
          <img src={addShape} alt='add shape' />
          <div className={styles.HoverContent}>
            <div className={styles.HoverTriangle}></div>
            <p className={styles.HoverText}>Add shape</p>
          </div>
        </div>
        {editorState.isShapeDropdown ? (
          <>
            <Backdrop />
            <div className={styles.ShapeDropdown}>
              <ShapeDropdown />
            </div>
          </>
        ) : null}
      </div>
      <div className={styles.DesignControl}>
        <div
          className={styles.AddShapeContainer}
          id='subtitles'
          onClick={clickHandler}
        >
          <img src={subtitles} alt='subtitles' />
          <div className={styles.HoverContent}>
            <div className={styles.HoverTriangle}></div>
            <p className={styles.HoverText}>Subtitles</p>
          </div>
        </div>
      </div>
      {editorState.isSubtitlesDropdown ? (
        <>
          <Backdrop />
          <div className={styles.SubtitlesDropdown}>
            <SubtitlesDropdown words={words} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DesignControls;
