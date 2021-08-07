import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from './ShapeToolbar.module.css';
import downArrow from '../../../assets/editor/downArrow.svg';
import cornerRadius from '../../../assets/editor/cornerRadius.svg';
import EditorContext from '../../../contexts/EditorContext';
import ShapeDropdowns from '../ShapeDropdowns/ShapeDropdowns';
import {
  initialLoadHandler,
  handleClick,
  fillChangeCompleteHandler,
  strokeChangeCompleteHandler,
  strokeWidthChangeHandler,
} from './utils/handlers';

const ShapeToolbar = ({ coords }) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [fill, setFill] = useState('rgba(196,196,196,1)');
  const [stroke, setStroke] = useState('rgba(255,255,255,1)');
  const [isFillDropdown, setIsFillDropdown] = useState(false);
  const [isStrokeDropdown, setIsStrokeDropdown] = useState(false);
  const [isStrokeWidthDropdown, setIsStrokeWidthDropdown] = useState(false);
  const [strokeWidthInput, setStrokeWidthInput] = useState(
    editorState.shapeState.strokeWidth
  );
  const [radiusInput, setRadiusInput] = useState(editorState.shapeState.rx);
  const shapeToolbarRef = useRef(null);
  const fillRef = useRef(null);
  const strokeRef = useRef(null);
  const strokeContainerRef = useRef(null);
  const isLine = editorState.currentObject.type === 'line';
  const isRect = editorState.currentObject.type === 'rect';

  const radiusChangeHandler = (e) => {
    setRadiusInput(e.target.value);
    let val = +e.target.value;
    if (val < 0) val = 0;
    if (val > 100) val = 100;
    editorDispatch({ type: 'setShapeRadius', data: val });
  };

  const clickHandler = (e) =>
    handleClick(
      e,
      setIsFillDropdown,
      setIsStrokeDropdown,
      setIsStrokeWidthDropdown
    );

  useEffect(() => {
    if (isFirstLoad) {
      initialLoadHandler(
        isLine,
        editorState.shapeState,
        setIsFirstLoad,
        setFill,
        fillRef,
        strokeContainerRef,
        setStroke,
        strokeRef
      );
    }
  }, [isLine, editorState.shapeState, isFirstLoad]);

  return (
    <div ref={shapeToolbarRef} className={styles.ShapeToolbar}>
      {!isLine ? (
        <>
          <div
            className={styles.FillContainer}
            id='fill'
            onClick={clickHandler}
          >
            <div className={styles.ColorPickerBorder}>
              <div ref={fillRef} className={styles.ColorPicker}></div>
            </div>
            <p>Fill</p>
          </div>
          <div className={styles.BorderDiv}></div>
        </>
      ) : null}

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
              strokeWidthChangeHandler(
                e,
                editorDispatch,
                setStrokeWidthInput,
                isLine
              )
            }
          />
        </div>
        <div
          style={{
            borderTopRightRadius: isRect ? '0' : '15px',
            borderBottomRightRadius: isRect ? '0' : '15px',
          }}
          className={styles.StrokeWidthArrowContainer}
          id='strokeWidth'
          onClick={clickHandler}
        >
          <img className={styles.DownArrow} src={downArrow} alt='arrow' />
        </div>
      </div>

      {isRect ? (
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
        </>
      ) : null}
      <ShapeDropdowns
        state={editorState}
        dispatch={editorDispatch}
        coords={coords}
        shapeToolbar={shapeToolbarRef.current}
        isStrokeWidthDropdown={isStrokeWidthDropdown}
        setIsStrokeWidthDropdown={setIsStrokeWidthDropdown}
        isStrokeDropdown={isStrokeDropdown}
        isFillDropdown={isFillDropdown}
        fill={fill}
        setFill={setFill}
        fillChangeCompleteHandler={fillChangeCompleteHandler}
        fillRef={fillRef}
        stroke={stroke}
        setStroke={setStroke}
        strokeChangeCompleteHandler={strokeChangeCompleteHandler}
        strokeRef={strokeRef}
        isLine={isLine}
        isRect={isRect}
      />
    </div>
  );
};

export default ShapeToolbar;
