import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from './CanvasToolbar.module.css';
import ResizeDropdown from './ResizeDropdown/ResizeDropdown';
import EditorContext from '../../contexts/EditorContext';
import Backdrop from '../../components/Backdrop/Backdrop';
import { ReactComponent as Templates } from '../../assets/editor/templates.svg';
import { ReactComponent as Resize } from '../../assets/editor/resize.svg';
import { ReactComponent as Crop } from '../../assets/editor/cropImage.svg';
import { SketchPicker } from 'react-color';

const CanvasToolbar = () => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [bgColor, setBgColor] = useState(
    editorState.canvasState.backgroundColor
  );
  const backgroundColorRef = useRef(null);
  const bgDropdownRef = useRef(null);
  const resizeDropdownRef = useRef(null);
  const clickHandler = (e) => {
    if (!editorState.shouldCropImage) {
      if (editorState.isCropMode) {
        editorDispatch({ type: 'setIsCropMode', data: false });
      }
      let id = e.currentTarget.id;
      if (id === 'resize') {
        editorDispatch({ type: 'setIsResizeDropdown', data: true });
      } else if (id === 'bgColor') {
        editorDispatch({ type: 'setIsCanvasBgColorDropdown', data: true });
      }
    }
  };

  const colorChangeCompleteHandler = (c) => {
    if (backgroundColorRef.current) {
      let colorString = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`;
      backgroundColorRef.current.style.background = colorString;
      editorDispatch({ type: 'setCanvasBackgroundColor', data: colorString });
    }
  };

  useEffect(() => {
    backgroundColorRef.current.style.background = bgColor;
  }, [bgColor]);

  return (
    <div className={styles.CanvasToolbar}>
      <div
        className={styles.TemplatesContainer}
        id='templates'
        onClick={clickHandler}
      >
        <Templates />
        <p className={styles.OptionText}>Templates</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div
        className={styles.ResizeContainer}
        id='resize'
        onClick={clickHandler}
      >
        <Resize />
        <p className={styles.OptionText}>Resize</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div className={styles.CropContainer} id='crop' onClick={clickHandler}>
        <Crop />
        <p className={styles.OptionText}>Crop</p>
      </div>
      <div className={styles.BorderDiv}></div>
      <div
        className={styles.ColorContainer}
        id='bgColor'
        onClick={clickHandler}
      >
        <div className={styles.ColorPickerBorder}>
          <div ref={backgroundColorRef} className={styles.ColorPicker}></div>
        </div>
        <p className={styles.OptionText}>Background color</p>
      </div>
      {editorState.isResizeDropdown ? (
        <>
          <Backdrop></Backdrop>
          <div className={styles.ResizeDropdown} ref={resizeDropdownRef}>
            <ResizeDropdown />
          </div>
        </>
      ) : null}

      {editorState.isCanvasBgColorDropdown ? (
        <>
          <Backdrop></Backdrop>
          <div className={styles.ColorDropdownContainer} ref={bgDropdownRef}>
            <SketchPicker
              color={bgColor}
              onChange={(c) => setBgColor(c.rgb)}
              onChangeComplete={colorChangeCompleteHandler}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CanvasToolbar;
