import React, { useState, useContext, useCallback } from 'react';
import styles from './PlayerCanvas.module.css';
import EditorContext from '../../../contexts/EditorContext';
import useAddObject from '../hooks/useAddObject';
import useSelectionObserver from '../hooks/useSelectionObserver';
import useGuideLines from '../hooks/useGuideLines';
import useUpdateObject from '../hooks/useUpdateObject';
import useUpdateCanvas from '../hooks/useUpdateCanvas';
import useCropMedia from '../hooks/useCropMedia';
import useAddCanvas from '../hooks/useAddCanvas';
import useAddSpeakers from '../hooks/useAddSpeakers';
import useKeyEvents from '../hooks/useKeyEvents';
import useClickListener from '../hooks/useClickListener';
import Toolbar from '../../Toolbar/Toolbar';
import ContextMenu from '../ContextMenu/ContextMenu';
import EventContext from '../../../contexts/EventContext';
import useAnimate from '../hooks/useAnimate';

const PlayerCanvas = ({
  canvas,
  setCanvas,
  video,
  fabricSub,
  currentTime,
  speakers,
  info,
  isPlaying,
  isCanvasSet,
  setIsCanvasSet,
}) => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const { eventState, eventDispatch } = useContext(EventContext);
  const [objectIdCount, setObjectIdCount] = useState(1);
  const [clipboard, setClipboard] = useState(null);
  const [isCanvasData, setIsCanvasData] = useState(false);
  const updatetObjectId = useCallback(() => setObjectIdCount((i) => i + 1), []);
  const [speakerVideos, setSpeakerVideos] = useState([]);

  useAnimate(isCanvasSet, canvas, speakerVideos, isPlaying, video, currentTime);
  useGuideLines(
    editorState.canvasState,
    isCanvasSet,
    canvas,
    eventState,
    eventDispatch,
    editorState.isCropMode
  );
  useAddObject(
    editorState,
    editorDispatch,
    canvas,
    objectIdCount,
    updatetObjectId
  );
  useSelectionObserver(isCanvasSet, canvas, editorState, editorDispatch);
  useUpdateObject(editorState, editorDispatch, canvas);
  useUpdateCanvas(editorState.canvasState, editorDispatch, canvas);
  useCropMedia(
    editorState,
    editorDispatch,
    canvas,
    objectIdCount,
    updatetObjectId
  );
  useAddCanvas(
    editorState.canvasState,
    setCanvas,
    setIsCanvasSet,
    'canvas',
    info,
    setIsCanvasData,
    speakers,
    setObjectIdCount,
    setSpeakerVideos
  );
  useKeyEvents(
    canvas,
    clipboard,
    setClipboard,
    objectIdCount,
    updatetObjectId,
    fabricSub,
    editorDispatch
  );
  useClickListener(canvas, editorState);
  useAddSpeakers(
    video,
    canvas,
    currentTime,
    speakers,
    objectIdCount,
    setObjectIdCount,
    isCanvasData,
    setSpeakerVideos
  );

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
        fabricSub={fabricSub}
        dispatch={editorDispatch}
      />
    </div>
  );
};

export default PlayerCanvas;
