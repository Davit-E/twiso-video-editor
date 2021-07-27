import React, { useContext } from 'react';
import styles from './ShapeDropdown.module.css';
import square from '../../../assets/square.svg';
import circle from '../../../assets/circle.svg';
import triangle from '../../../assets/triangle.svg';
import line from '../../../assets/line.svg';
import EditorContext from '../../../contexts/EditorContext';

const ShapeDropdown = () => {
  const { editorDispatch } = useContext(EditorContext);
  const clickHandler = (e) => {
    if (e.target.tagName === 'IMG') {
      editorDispatch({ type: 'setShapeToAdd', data: e.target.id });
    } else if (e.target.classList.contains(styles.ShapeContainer)) {
      editorDispatch({ type: 'setShapeToAdd', data: e.target.childNodes[0].id });
    }
  };

  return (
    <div className={styles.Dropdown} onClick={clickHandler}>
      <div className={styles.ShapeContainer}>
        <img className={styles.Shape} src={square} alt='square' id='square' />
      </div>
      <div className={styles.ShapeContainer}>
        <img className={styles.Shape} src={circle} alt='circle' id='circle' />
      </div>
      <div className={styles.ShapeContainer}>
        <img
          className={styles.Shape}
          src={triangle}
          alt='triangle'
          id='triangle'
        />
      </div>
      <div className={styles.ShapeContainer}>
        <img className={styles.Shape} src={line} alt='line' id='line' />
      </div>
    </div>
  );
};

export default ShapeDropdown;
