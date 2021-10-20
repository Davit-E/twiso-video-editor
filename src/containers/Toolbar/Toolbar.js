import React, {
  useContext,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import EditorContext from '../../contexts/EditorContext';
import styles from './Toolbar.module.css';
import { calcPosition } from './utils/toolbarPosition';
import TextToolbar from './TextToolbar/TextToolbar';
import ShapeToolbar from './ShapeToolbar/ShapeToolbar';
import ImageToolbar from './ImageToolbar/ImageToolbar';
import VideoToolbar from './VideoToolbar/VideoToolbar';

const Toolbar = ({ canvas }) => {
  const [coords, setCoords] = useState(null);
  const { editorState } = useContext(EditorContext);
  const toolbarRef = useRef(null);
  const toolbarOffset = 28;
  const toolbarPadding = 10;
  const shapeArr = ['rect', 'circle', 'triangle', 'line'];
  const setTransform = useCallback((c) => {
    toolbarRef.current.style.transform = `translate(${c.coordX}px, ${c.coordY}px)`;
    toolbarRef.current.style.opacity = 1;
    setCoords(c);
  }, []);

  useEffect(() => {
    if (editorState.currentCoords) {
      setTransform(
        calcPosition(
          editorState.currentCoords,
          canvas.getWidth(),
          canvas.getHeight(),
          toolbarRef.current,
          toolbarOffset,
          toolbarPadding
        )
      );
    }
  }, [
    canvas,
    setTransform,
    editorState.currentCoords,
    editorState.isCroppingImage,
  ]);

  return (
    <div ref={toolbarRef} className={styles.Toolbar}>
      {editorState.currentObject.type === 'text' ? (
        <TextToolbar coords={coords} isSub={false} />
      ) : null}
      {editorState.currentObject.type === 'subtitle' ? (
        <TextToolbar coords={coords} isSub={true} />
      ) : null}
      {shapeArr.includes(editorState.currentObject.type) ? (
        <ShapeToolbar coords={coords} />
      ) : null}
      {editorState.currentObject.type === 'customImage' ? (
        <ImageToolbar />
      ) : null}
      {editorState.currentObject.type === 'video' ? (
        <VideoToolbar coords={coords} />
      ) : null}
    </div>
  );
};

export default Toolbar;
