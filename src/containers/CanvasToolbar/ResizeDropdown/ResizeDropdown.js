import React, { useContext } from 'react';
import EditorContext from '../../../contexts/EditorContext';
import styles from './ResizeDropdown.module.css';

const getResizeValues = (initialWidth, initialHeight, id) => {
  let width = initialWidth;
  let height = initialHeight;
  let resize = 'original';
  if (id === 'landscape') {
    width = (height * 16) / 9;
    height = (width * 9) / 16;
    resize = id;
  } else if (id === 'square') {
    width = height;
    resize = id;
  } else if (id === 'vertical') {
    width = (height * 9) / 16;
    resize = id;
  }
  return { width, height, resize };
};

const options = [
  {
    name: 'original',
    text: 'Original size',
    boxStyle: { width: '6.375rem' },
  },
  {
    name: 'landscape',
    text: 'Landscape 16:9',
    boxStyle: { width: '11.25rem' },
  },
  {
    name: 'square',
    text: 'Square 1:1',
    boxStyle: { width: '6.375rem' },
  },
  {
    name: 'vertical',
    text: 'Vertical 9:16',
    boxStyle: { width: '3.6875rem' },
  },
];

const ResizeDropdown = () => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const clickHandler = (e) => {
    let id = e.currentTarget.id;
    let { width, height, resize } = getResizeValues(
      editorState.canvasState.initialWidth,
      editorState.canvasState.initialHeight,
      id
    );
    editorDispatch({ type: 'setVideoSize', data: { width, height, resize } });
    editorDispatch({ type: 'setIsResizeDropdown', data: false });
  };

  return (
    <div className={styles.Dropdown}>
      <ul className={styles.SizeOptions}>
        {options.map((size) => {
          return (
            <li
              key={size.name}
              id={size.name}
              className={[
                styles.SizeOption,
                editorState.canvasState.resize === size.name
                  ? styles.Current
                  : null,
              ].join(' ')}
              onClick={clickHandler}
            >
              <p className={styles.SizeOptionText}>{size.text}</p>
              <div className={styles.SizeOptionBox} style={size.boxStyle}></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ResizeDropdown;
