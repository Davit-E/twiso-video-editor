import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './TranscriptionProgress.module.css';

const TranscriptionProgress = ({ status, words, setIsFinished }) => {
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(false);
  const intervalRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      if (status.isFinished) setIsFinished(true);
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, status, setIsFinished]);

  useEffect(() => {
    let interval = intervalRef.current;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const progressInterval = useCallback((intervalTime) => {
    let interval = setInterval(() => {
      if (isMounted.current) {
        setProgress((prevState) => {
          if (prevState >= 99) {
            clearInterval(interval);
            return 99;
          } else return prevState + 1;
        });
      }
    }, intervalTime);
    intervalRef.current = interval;
  }, []);

  const progressHandler = useCallback(
    (status) => {
      if (status.timeLeft && status.timeLeft > 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        let start = new Date(+status.startDate * 1000);
        let now = new Date();
        let secondsElapsed = Math.floor((now - start) / 1000);
        let estimatedTime = secondsElapsed + status.timeLeft;
        let finishedPercentage = (secondsElapsed * 100) / estimatedTime;
        setProgress(finishedPercentage);
        let intervalTime =
          (status.timeLeft * 1000) / (100 - finishedPercentage);
        setProgress(finishedPercentage);
        progressInterval(intervalTime);
      } else setProgress(99);
    },
    [progressInterval]
  );

  useEffect(() => {
    let interval = null;
    if (!isFirstLoad && status.isFinished) {
      clearInterval(intervalRef.current);
      let interval = setInterval(() => {
        if (isMounted.current) {
          setProgress((prevState) => {
            if (prevState >= 100) {
              clearInterval(interval);
              return 100;
            } else return prevState + 1;
          });
        }
      }, 100);
    } else progressHandler(status);

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isFirstLoad, status, progressHandler]);

  useEffect(() => {
    let timeout = null;
    if (progress === 100 && words) {
      timeout = setTimeout(() => {
        if (isMounted.current) setIsFinished(true);
      }, 500);
    }

    return () => {
      if (timeout !== null) clearTimeout(timeout);
    };
  }, [progress, words, setIsFinished]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  return (
    <div className={styles.TranscriptionProgress}>
      {!isFirstLoad ? (
        <>
          <p className={styles.Heading}>
            We are transcribing your video, this process may take several
            minutes. Once it's finished, you can edit your video by editing
            text.
          </p>
          <p className={styles.Percentage}>{Math.floor(progress)}%</p>
          <div className={styles.Box}>
            {[...Array(20)].map((x, i) => (
              <div className={styles.Line} key={i}></div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default TranscriptionProgress;
