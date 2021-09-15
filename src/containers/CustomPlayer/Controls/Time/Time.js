import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Time.module.css';
import TimelineSlider from './TimelineSlider/TimelineSlider';

const Time = ({
  duration,
  time,
  setTime,
  isPlaying,
  video
}) => {
  const [isMoreThanHour, setIsMoreThanHour] = useState(false);
  const timeStrRef = useRef(null);
  const [timeString, setTimeString] = useState('00:00');

  const generateTimeString = useCallback((t) => {
    let timeStr = '';
    let h = Math.floor(t / 3600);
    let m = Math.floor((t % 3600) / 60);
    let s = Math.floor((t % 3600) % 60);
    if (h > 0) {
      h < 10 ? (timeStr += '0' + h + ':') : (timeStr += h + ':');
      setIsMoreThanHour(true);
    } else setIsMoreThanHour(false);
    if (m < 10) timeStr += '0';
    timeStr += m + ':';
    if (s < 10) timeStr += '0';
    timeStr += s;
    setTimeString(timeStr);
  }, []);

  useEffect(() => {
    if (isMoreThanHour) timeStrRef.current.style.width = '4rem';
    else timeStrRef.current.style.width = '3rem';
  }, [isMoreThanHour]);

  useEffect(() => {
    generateTimeString(time);
  }, [time, generateTimeString]);

  return (
    <>
      <p ref={timeStrRef} className={styles.Time}>
        {timeString}
      </p>
      <div className={styles.Timeline}>
        <TimelineSlider
          min='0'
          max={duration}
          step='0.01'
          value={time}
          setValue={setTime}
          isPlaying={isPlaying}
          video={video}
        />
      </div>
    </>
  );
};

export default Time;
