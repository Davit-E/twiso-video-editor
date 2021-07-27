import React, { useState, useContext, useCallback } from 'react';
import styles from './Canvas.module.css';
import EditorContext from '../../contexts/EditorContext';
import fabricConfig from './fabricConfig';
import useAddObject from './canvasHooks/useAddObject';
import useSelectionObserver from './canvasHooks/useSelectionObserver';
import useGuidelines from './canvasHooks/useGuideLines';
import useUpdateObject from './canvasHooks/useUpdateObject';
import Toolbar from '../Toolbar/Toolbar';
import useCropImage from './canvasHooks/useCropImage';
import useAddCanvas from './canvasHooks/useAddCanvas';
import useAddVideo from './canvasHooks/useAddVideo';
import useKeyEvents from './canvasHooks/useKeyEvents';
import useClickListener from './canvasHooks/useClickListener';
import ContextMenu from './ContextMenu/ContextMenu';
fabricConfig();

const Canvas = ({ canvas, setCanvas, video }) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const [objectIdCount, setObjectIdCount] = useState(1);
  const [isCanvasSet, setIsCanvasSet] = useState(false);
  const [clipboard, setClipboard] = useState(null);
  const updatetObjectId = useCallback(() => setObjectIdCount((i) => i + 1), []);

  useGuidelines(editorState, isCanvasSet, canvas);
  useAddObject(editorState, editorDispatch, canvas, objectIdCount, updatetObjectId);
  useSelectionObserver(isCanvasSet, canvas, editorState, editorDispatch);
  useUpdateObject(editorState, editorDispatch, canvas);
  useCropImage(editorState, editorDispatch, canvas, objectIdCount, updatetObjectId);
  useAddCanvas(editorState, setCanvas, setIsCanvasSet);
  useKeyEvents(canvas, clipboard, setClipboard, objectIdCount, updatetObjectId);
  useClickListener(canvas, editorState);
  useAddVideo(video, canvas);

  return (
    <div className={styles.CanvasComponent} id='canvasComponent'>
      <div className={styles.Canvas}>
        <canvas id='canvas' />
      </div>
      {editorState.showToolbar ? <Toolbar canvas={canvas} /> : null}
      <ContextMenu
        canvas={canvas}
        isCanvasSet={isCanvasSet}
        objId={objectIdCount}
        updateId={updatetObjectId}
        clipboard={clipboard}
        setClipboard={setClipboard}
      />
    </div>
  );
};

export default Canvas;
