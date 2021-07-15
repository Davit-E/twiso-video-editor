import React, { useContext, useState, useEffect, useRef } from 'react';
import styles from './CanvasToolbar.module.css';
import ResizeDropdown from './ResizeDropdown/ResizeDropdown';
import AppContext from '../../contexts/AppContext';
import Backdrop from '../../components/Backdrop/Backdrop';
import { ReactComponent as Templates } from '../../assets/templates.svg';
import { ReactComponent as Resize } from '../../assets/resize.svg';
import { SketchPicker } from 'react-color';

const CanvasToolbar = ({ player }) => {
  const { appState, appDispatch } = useContext(AppContext);
  const [bgColor, setBgColor] = useState(appState.canvasState.backgroundColor);
  const backgroundColorRef = useRef(null);
  const bgDropdownRef = useRef(null);
  const resizeDropdownRef = useRef(null);
  const clickHandler = (e) => {
    if (!appState.shouldCropImage) {
      if (appState.isCropMode) {
        appDispatch({ type: 'setIsCropMode', data: false });
      }
      let id = e.currentTarget.id;
      if (id === 'resize') {
        // appDispatch({ type: 'setIsResizeDropdown', data: true });
      } else if (id === 'bgColor') {
        appDispatch({ type: 'setIsCanvasBgColorDropdown', data: true });
      }
    }
  };

  const colorChangeCompleteHandler = (c) => {
    let colorString = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`;
    backgroundColorRef.current.style.background = colorString;
    appDispatch({ type: 'setCanvasBackgroundColor', data: colorString });
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
      {appState.isResizeDropdown ? (
        <>
          <Backdrop></Backdrop>
          <div className={styles.ResizeDropdown} ref={resizeDropdownRef}>
            <ResizeDropdown
              state={appState.canvasState}
              dispatch={appDispatch}
            />
          </div>
        </>
      ) : null}

      {appState.isCanvasBgColorDropdown ? (
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
