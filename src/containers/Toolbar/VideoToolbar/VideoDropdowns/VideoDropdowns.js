import React, { useState, useEffect, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import styles from './VideoDropdowns.module.css';
import StrokeWidthDropdown from '../../StrokeWidthDropdown/StrokeWidthDropdown';

const VideoDropdowns = ({
  state,
  dispatch,
  coords,
  videoToolbar,
  isStrokeWidthDropdown,
  setIsStrokeWidthDropdown,
  isStrokeDropdown,
  stroke,
  setStroke,
  strokeChangeCompleteHandler,
  strokeRef,
}) => {
  const [dropDownStyle, setDropdownStyle] = useState({ top: 41 });
  const maxDropdownHeight = 301;
  const maxDropdownWidth = 220;
  const DropdownOffset = 41;
  const DropdownPadding = 20;

  const handleDropdownPosition = useCallback(
    (coords, shapeToolbar, canvasHeight) => {
      let toolbarWidth = shapeToolbar.offsetWidth;
      let style = {};
      if (
        coords.coordY + maxDropdownHeight + DropdownOffset + DropdownPadding >
        canvasHeight
      ) {
        style.bottom = 41;
      }

      if (coords.coordX + toolbarWidth - maxDropdownWidth < 0) {
        style.left = 0;
        if (!style.bottom) style.top = 41;
      }
      if (Object.keys(style).length !== 0) setDropdownStyle(style);
    },
    []
  );

  useEffect(() => {
    if (coords && videoToolbar) {
      handleDropdownPosition(coords, videoToolbar, state.canvasState.height);
    }
  }, [handleDropdownPosition, videoToolbar, state.canvasState, coords]);

  return (
    <>
      {isStrokeDropdown ? (
        <div className={styles.StrokeDropdownContainer} style={dropDownStyle}>
          <SketchPicker
            color={stroke}
            onChange={(c) => setStroke(c.rgb)}
            onChangeComplete={(c) =>
              strokeChangeCompleteHandler(c, dispatch, strokeRef)
            }
          />
        </div>
      ) : null}

      {isStrokeWidthDropdown ? (
        <div
          className={styles.StrokeWidthDropdownContainer}
          style={dropDownStyle}
        >
          <StrokeWidthDropdown
            type={'setVideoStrokeWidth'}
            setIsDropDown={setIsStrokeWidthDropdown}
            isSmallRange={true}
            includesZero={true}
            dispatch={dispatch}
          />
        </div>
      ) : null}
    </>
  );
};

export default VideoDropdowns;
