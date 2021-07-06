import React, { useState, useContext, useCallback } from 'react';
import styles from './Canvas.module.css';
import AppContext from '../../contexts/AppContext';
import fabricConfig from './fabricConfig';
import useAddObject from './canvasHooks/useAddObject';
import useSelectionObserver from './canvasHooks/useSelectionObserver';
import useGuidelines from './canvasHooks/useGuideLines';
import useUpdateObject from './canvasHooks/useUpdateObject';
import Toolbar from '../Toolbar/Toolbar';
import useCropImage from './canvasHooks/useCropImage';
import useAddCanvas from './canvasHooks/useAddCanvas';

fabricConfig();

const Canvas = ({ canvas, setCanvas, size }) => {
  const { appState, appDispatch } = useContext(AppContext);
  const [objectIdCount, setObjectIdCount] = useState(1);
  const [isCanvasSet, setIsCanvasSet] = useState(false);
  const updatetObjectId = useCallback(() => setObjectIdCount((i) => i + 1), []);

  useGuidelines(appState, isCanvasSet, canvas);
  useAddObject(appState, appDispatch, canvas, objectIdCount, updatetObjectId);
  useSelectionObserver(isCanvasSet, canvas, appState, appDispatch);
  useUpdateObject(appState, appDispatch, canvas);
  useCropImage(appState, appDispatch, canvas, objectIdCount, updatetObjectId);
  useAddCanvas(appState, setCanvas, setIsCanvasSet, size);

  return (
    <div className={styles.CanvasComponent}>
      <div className={styles.Canvas}>
        <canvas id='canvas' />
      </div>
      {appState.showToolbar ? <Toolbar canvas={canvas} /> : null}
    </div>
  );
};

export default Canvas;
