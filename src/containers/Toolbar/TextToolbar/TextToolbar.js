import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from './TextToolbar.module.css';
import downArrow from '../../../assets/downArrow.svg';
import bold from '../../../assets/bold.svg';
import italic from '../../../assets/italic.svg';
import textLeft from '../../../assets/textLeft.svg';
import textRight from '../../../assets/textRight.svg';
import textCenter from '../../../assets/textCenter.svg';
import textJustify from '../../../assets/textJustify.svg';
import TextDropdowns from '../TextDropdowns/TextDropdowns';
import EditorContext from '../../../contexts/EditorContext';
import {
  handleClick,
  fontSizeChangeHandler,
  colorChangeCompleteHandler,
} from './utils/handlers';

const TextToolbar = ({ coords }) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [fontSizeInput, setFontSizeInput] = useState(
    editorState.textState.fontSize
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isFontFamilyDropdown, setIsFontFamilyDropdown] = useState(false);
  const [isFontSizeDropdown, setIsFontSizeDropdown] = useState(false);
  const [isColorDropdown, setIsColorDropdown] = useState(false);
  const [isTextAlignDropDown, setIsTextAlignDropDown] = useState(false);
  const [color, setColor] = useState({
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  });
  const colorPickerRef = useRef(null);

  // Active styles
  const boldStlyes = [styles.FontWeightBoldContainer];
  const italicStyles = [styles.FontStyleItalicContainer];
  const isBold = editorState.textState.fontWeight === 'Bold';
  const isItalic = editorState.textState.fontStyle === 'Italic';
  if (isBold) boldStlyes.push(styles.Active);
  if (isItalic) italicStyles.push(styles.Active);

  // Text Align SVG
  let textAlignSrc = textLeft;
  if (editorState.textState.textAlign === 'center') {
    textAlignSrc = textCenter;
  } else if (editorState.textState.textAlign === 'right') {
    textAlignSrc = textRight;
  } else if (editorState.textState.textAlign === 'justify') {
    textAlignSrc = textJustify;
  }

  const boldHandler = () => {
    let weight = 'Bold';
    if (isBold) weight = 'Normal';
    editorDispatch({ type: 'setFontWeight', data: weight });
  };

  const italicHandler = () => {
    let style = 'Italic';
    if (isItalic) style = 'Normal';
    editorDispatch({ type: 'setFontStyle', data: style });
  };

  const dropdownHandlers = {
    fontFamily: setIsFontFamilyDropdown,
    fontSizeArrow: setIsFontSizeDropdown,
    colorPicker: setIsColorDropdown,
    textAlign: setIsTextAlignDropDown,
  };

  const styleHandlers = {
    bold: boldHandler,
    italic: italicHandler,
  };

  const clickHandler = (e) => handleClick(e, dropdownHandlers, styleHandlers);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      const [r, g, b, a] = editorState.textState.fill
        .split('(')[1]
        .split(')')[0]
        .split(',');
      setColor({ r, g, b, a });
      colorPickerRef.current.style.background = editorState.textState.fill;
    }
  }, [editorState.textState.fill, isFirstLoad]);

  return (
    <div className={styles.TextToolbar}>
      <div
        className={styles.FontsContainer}
        id='fontFamily'
        onClick={clickHandler}
      >
        <p>{editorState.textState.fontFamily}</p>
        <img className={styles.DownArrow} src={downArrow} alt='arrow' />
      </div>
      <div className={styles.BorderDiv}></div>
      <div className={styles.FontSizeContainer}>
        <div className={styles.FontSizeInputContainer}>
          <input
            className={styles.FontSizeInput}
            type='number'
            value={fontSizeInput}
            onChange={(e) =>
              fontSizeChangeHandler(e, setFontSizeInput, editorDispatch)
            }
          />
        </div>
        <div
          className={styles.FontSizeArrowContainer}
          id='fontSizeArrow'
          onClick={clickHandler}
        >
          <img className={styles.DownArrow} src={downArrow} alt='arrow' />
        </div>
      </div>
      <div className={styles.BorderDiv}></div>

      <div
        className={styles.ColorPickerContainer}
        id='colorPicker'
        onClick={clickHandler}
      >
        <div className={styles.ColorPickerBorder}>
          <div ref={colorPickerRef} className={styles.ColorPicker}></div>
        </div>
      </div>
      <div className={styles.BorderDiv}></div>

      <div className={boldStlyes.join(' ')} id='bold' onClick={clickHandler}>
        <img className={styles.Bold} src={bold} alt='bold' />
      </div>
      <div className={styles.BorderDiv}></div>

      <div
        className={italicStyles.join(' ')}
        id='italic'
        onClick={clickHandler}
      >
        <img className={styles.Italic} src={italic} alt='italic' />
      </div>
      <div className={styles.BorderDiv}></div>

      <div
        className={styles.TextAlignContainer}
        id='textAlign'
        onClick={clickHandler}
      >
        <img className={styles.TextAlign} src={textAlignSrc} alt='textAlign' />
      </div>
      <TextDropdowns
        state={editorState}
        dispatch={editorDispatch}
        coords={coords}
        isFontFamilyDropdown={isFontFamilyDropdown}
        isFontSizeDropdown={isFontSizeDropdown}
        isColorDropdown={isColorDropdown}
        isTextAlignDropDown={isTextAlignDropDown}
        setIsFontFamilyDropdown={setIsFontFamilyDropdown}
        setIsFontSizeDropdown={setIsFontSizeDropdown}
        colorChangeCompleteHandler={colorChangeCompleteHandler}
        setIsTextAlignDropDown={setIsTextAlignDropDown}
        setColor={setColor}
        color={color}
        colorPickerRef={colorPickerRef}
      />
    </div>
  );
};

export default TextToolbar;
