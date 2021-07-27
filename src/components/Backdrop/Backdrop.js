import React, { useContext } from 'react';
import styles from './Backdrop.module.css';
import EditorContext from '../../contexts/EditorContext';

const Backdrop = (props) => {
  const { editorState, editorDispatch } = useContext(EditorContext);

  const clickHandler = (e) => {
    if (e.target.id === 'backdrop') {
      let actionType = '';
      if (editorState.isImageDropdown) actionType = 'setIsImageDropdown';
      else if (editorState.isShapeDropdown) actionType = 'setIsShapeDropdown';
      else if (editorState.isSubtitlesDropdown)
        actionType = 'setIsSubtitlesDropdown';
      else if (editorState.shouldReplaceImage)
        actionType = 'setShouldReplaceImage';
      else if (editorState.isResizeDropdown) actionType = 'setIsResizeDropdown';
      else if (editorState.isCanvasBgColorDropdown)
        actionType = 'setIsCanvasBgColorDropdown';
      else if (editorState.isZoomDropdown) actionType = 'setIsZoomDropdown';
      else if (editorState.shouldAddCanvasBgImage)
        actionType = 'setShouldAddCanvasBgImage';
      else if (editorState.isDownloadDropdown)
        actionType = 'setIsDownloadDropdown';
      editorDispatch({ type: actionType, data: false });
    }
  };

  return (
    <div className={styles.Backdrop} onClick={clickHandler} id='backdrop'>
      {props.children}
    </div>
  );
};
export default Backdrop;
