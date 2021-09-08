import React, { useEffect, useRef } from 'react';
import styles from './VolumeSlider.module.css';
import { handleInputChange } from '../utils/slider';

const VolumeSlider = ({ min, max, step, value, setValue }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    handleInputChange(value, min, max, inputRef);
  }, [value, min, max]);

  return (
    <input
      type='range'
      ref={inputRef}
      className={styles.Slider}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default VolumeSlider;