import React from 'react';
import styles from './FontSizeDropdown.module.css';

const FontSizeDropdown = ({ setIsDropDown, dispatch, isSub }) => {
  const optionsClickHandler = (e) => {
    if (e.target.tagName === 'LI') {
      let type = isSub ? 'setSubtitlesFontSize' : 'setFontSize';
      dispatch({ type, data: e.target.textContent });
      dispatch({ type: 'setShowToolbar', data: false });
      setIsDropDown(false);
    }
  };

  return (
    <ul className={styles.FontSizeDropdown} onClick={optionsClickHandler}>
      <li className={styles.FontSizeOption}>14</li>
      <li className={styles.FontSizeOption}>24</li>
      <li className={styles.FontSizeOption}>30</li>
      <li className={styles.FontSizeOption}>36</li>
      <li className={styles.FontSizeOption}>48</li>
      <li className={styles.FontSizeOption}>60</li>
      <li className={styles.FontSizeOption}>72</li>
      <li className={styles.FontSizeOption}>96</li>
    </ul>
  );
};

export default FontSizeDropdown;
