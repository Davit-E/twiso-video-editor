import React, { useState, useEffect, useRef } from 'react';
import FontsDropdown from './FontsDropdown/FontsDropdown';
import FontSizeDropdown from './FontSizeDropdown/FontSizeDropdown';
import TextAlignDropdown from './TextAlignDropdown/TextAlignDropdown';
import { SketchPicker } from 'react-color';
import styles from './TextDropdowns.module.css';

const TextDropdowns = ({
  state,
  dispatch,
  coords,
  isFontFamilyDropdown,
  isFontSizeDropdown,
  isColorDropdown,
  isTextAlignDropDown,
  setIsFontFamilyDropdown,
  setIsFontSizeDropdown,
  colorChangeCompleteHandler,
  setIsTextAlignDropDown,
  setColor,
  color,
  colorPickerRef,
  isSub,
  isBgColorDropdown,
  setBgColor,
  bgColor,
  bgColorPickerRef
}) => {
  const [dropDownStyle, setDropdownStyle] = useState({ top: 41 });
  const maxDropdownHeight = 301;
  const DropdownOffset = 41;
  const DropdownPadding = 20;
  const fontSizeDropdownRef = useRef(null);

  useEffect(() => {
    if (isFontSizeDropdown && isSub) {
      fontSizeDropdownRef.current.style.right = '223px';
    } else if (isFontSizeDropdown) {
      fontSizeDropdownRef.current.style.right =  '151px';
    }
  }, [isSub, isFontSizeDropdown]);

  useEffect(() => {
    if (
      coords &&
      coords.coordY + maxDropdownHeight + DropdownOffset + DropdownPadding >
        state.canvasState.height
    ) {
      setDropdownStyle({ bottom: 41 });
    }
  }, [state.canvasState, coords]);

  return (
    <>
      {isFontFamilyDropdown ? (
        <div className={styles.FontsDropdown} style={dropDownStyle}>
          <FontsDropdown
            setIsDropDown={setIsFontFamilyDropdown}
            dispatch={dispatch}
            isSub={isSub}
          />
        </div>
      ) : null}
      {isFontSizeDropdown ? (
        <div
          className={styles.FontSizeDropdown}
          style={dropDownStyle}
          ref={fontSizeDropdownRef}
        >
          <FontSizeDropdown
            setIsDropDown={setIsFontSizeDropdown}
            dispatch={dispatch}
            isSub={isSub}
          />
        </div>
      ) : null}
      {isColorDropdown ? (
        <div className={styles.SketchPickerContainer} style={dropDownStyle}>
          <SketchPicker
            color={color}
            onChange={(c) => setColor(c.rgb)}
            onChangeComplete={(c) =>
              colorChangeCompleteHandler(
                c,
                colorPickerRef,
                dispatch,
                isSub,
                isBgColorDropdown
              )
            }
          />
        </div>
      ) : null}
      {isTextAlignDropDown ? (
        <div className={styles.TextAlignDropdown} style={dropDownStyle}>
          <TextAlignDropdown
            setIsDropDown={setIsTextAlignDropDown}
            dispatch={dispatch}
            current={state.textState.textAlign}
          />
        </div>
      ) : null}

      {isBgColorDropdown ? (
        <div className={styles.SketchPickerContainer} style={dropDownStyle}>
          <SketchPicker
            color={bgColor}
            onChange={(c) => setBgColor(c.rgb)}
            onChangeComplete={(c) =>
              colorChangeCompleteHandler(
                c,
                bgColorPickerRef,
                dispatch,
                isSub,
                isBgColorDropdown
              )
            }
          />
        </div>
      ) : null}
    </>
  );
};

export default TextDropdowns;
