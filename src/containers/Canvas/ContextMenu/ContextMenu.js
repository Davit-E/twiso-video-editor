import React, {
  useEffect,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import styles from './ContextMenu.module.css';
import EventContext from '../../../contexts/EventContext';
import { handlePaste } from '../canvasHooks/utils/pasteObject';

const ContextMenu = ({
  canvas,
  isCanvasSet,
  objId,
  updateId,
  clipboard,
  setClipboard,
}) => {
  const { eventState, eventDispatch } = useContext(EventContext);
  const [isMounted, setIsMounted] = useState(false);
  const [activeObj, setActiveObj] = useState(false);
  const [canOnlyPaste, setCanOnlyPaste] = useState(false);
  const menuRef = useRef(null);

  const handleClick = useCallback(
    (e) => {
      if (e.currentTarget || clipboard) {
        if (e.currentTarget) {
          let active = canvas.getActiveObject();
          if (!active || active.id !== e.currentTarget.id) {
            canvas.setActiveObject(e.currentTarget);
          }
          setActiveObj(e.currentTarget);
          setCanOnlyPaste(false);
        } else setCanOnlyPaste(true);
        if (e.pointer.x + menuRef.current.offsetWidth > canvas.getWidth()) {
          menuRef.current.style.left =
            e.pointer.x - menuRef.current.offsetWidth + 'px';
        } else menuRef.current.style.left = e.pointer.x + 'px';
        menuRef.current.style.top = e.pointer.y + 'px';
      } else {
        eventDispatch({ type: 'setRightClickEvent', data: null });
      }
    },
    [canvas, eventDispatch, clipboard]
  );

  const overlayClickHandler = (e) => {
    e.preventDefault();
    if (isMounted) {
      setIsMounted(false);
      eventDispatch({ type: 'setRightClickEvent', data: null });
    }
  };

  const optionClickHandler = (e) => {
    let id = e.currentTarget.id;
    if (id === 'delete' && activeObj.id !== 'video') {
      canvas.remove(activeObj);
      canvas.discardActiveObject().requestRenderAll();
      eventDispatch({ type: 'setRightClickEvent', data: null });
    } else if (id === 'bringToFront') {
      canvas.bringToFront(activeObj);
      eventDispatch({ type: 'setRightClickEvent', data: null });
    } else if (id === 'sendToBack') {
      canvas.sendToBack(activeObj);
      eventDispatch({ type: 'setRightClickEvent', data: null });
    } else if (id === 'copy') {
      setClipboard({
        object: activeObj,
        coords: { top: activeObj.top, left: activeObj.left },
      });
      eventDispatch({ type: 'setRightClickEvent', data: null });
    } else if (id === 'paste') {
      if (clipboard) {
        handlePaste(
          canvas,
          clipboard,
          objId,
          updateId,
          setClipboard,
          eventDispatch
        );
      } else eventDispatch({ type: 'setRightClickEvent', data: null });
    }
  };

  useEffect(() => {
    if (isCanvasSet && eventState.rightClickEvent) {
      handleClick(eventState.rightClickEvent);
      setTimeout(() => {
        setIsMounted(true);
      }, 400);
    }
    return () => setIsMounted(false);
  }, [isCanvasSet, eventState.rightClickEvent, handleClick]);
  let isVideo = activeObj && activeObj.id === 'video';
  let content = (
    <>
      <div
        className={styles.Overlay}
        onContextMenu={overlayClickHandler}
        onClick={overlayClickHandler}
      ></div>
      <ul
        onContextMenu={(e) => e.preventDefault()}
        ref={menuRef}
        className={styles.Menu}
        id='contextMenu'
      >
        {!canOnlyPaste && !isVideo ? (
          <li className={styles.Option} id='copy' onClick={optionClickHandler}>
            <p>Copy</p>
            <p>⌘C</p>
          </li>
        ) : null}

        <li className={styles.Option} id='paste' onClick={optionClickHandler}>
          <p>Paste</p>
          <p>⌘V</p>
        </li>

        {!canOnlyPaste && !isVideo ? (
          <li
            className={styles.Option}
            id='delete'
            onClick={optionClickHandler}
          >
            <p>Delete</p>
            <p>DEL</p>
          </li>
        ) : null}
        {!canOnlyPaste ? <li className={styles.Border}></li> : null}
        {!canOnlyPaste ? (
          <>
            <li
              className={styles.Option}
              id='bringToFront'
              onClick={optionClickHandler}
            >
              <p>Bring to front</p>
              <p>{'⌘]'}</p>
            </li>
            <li
              className={styles.Option}
              id='sendToBack'
              onClick={optionClickHandler}
            >
              <p>Send to back</p>
              <p>{'⌘['}</p>
            </li>
          </>
        ) : null}
      </ul>
    </>
  );

  return eventState.rightClickEvent ? content : null;
};

export default ContextMenu;
