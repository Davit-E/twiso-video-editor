import React, { useEffect, useRef, useState } from 'react';
import styles from './TimelineSlider.module.css';
import { handleInputChange } from '../../utils/slider';

const TimelineSlider = ({
  min,
  max,
  step,
  value,
  setValue,
  isPlaying,
  video,
}) => {
  const inputRef = useRef(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    handleInputChange(value, min, max, inputRef);
  }, [value, min, max]);

  const mouseDownHandler = (e) => {
    if (isPlaying) {
      setShouldPlay(true);
      video.pause();
    } else {
      setShouldPlay(false);
    }
  };

  const mouseUpHandler = (e) => {
    if (shouldPlay) video.play();
  };

  const changeHandler = (e) => {
    setValue(e.target.value);
    video.currentTime = e.target.value;
  };

  return (
    <input
      type='range'
      ref={inputRef}
      className={styles.Slider}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={changeHandler}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
    />
  );
};

export default TimelineSlider;
