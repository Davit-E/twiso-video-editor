import { useEffect, useCallback } from 'react';

const usePlayerTime = (
  videoRef,
  videoCuts,
  words,
  isPlaying,
  currentTime,
  nextCutIndex,
  setNextCutIndex,
  currentWordIndex,
  setCurrentWordIndex,
  subArr,
  currentSubIndex,
  setCurrentSubIndex,
  currentSub
) => {
  const handleVideoCuts = useCallback(
    (time) => {
      if (videoCuts.length > 0 && videoCuts[nextCutIndex]) {
        time = +time + 0.05;
        let moreThanStart = time >= +videoCuts[nextCutIndex].start;
        let lessThanEnd = time <= +videoCuts[nextCutIndex].end;
        let isShortTime =
          +videoCuts[nextCutIndex].end - videoCuts[nextCutIndex].start <=
            0.05 && moreThanStart;
        if ((moreThanStart && lessThanEnd) || isShortTime) {
          videoRef.current.currentTime = +videoCuts[nextCutIndex].end;
          // console.log(
          //   `%c setting to: ${+videoCuts[nextCutIndex].end}`,
          //   'background:red; color:white'
          // );

          if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
          else setNextCutIndex(null);
        }
      }
    },
    [videoCuts, nextCutIndex, videoRef, setNextCutIndex]
  );

  const handleCurrentWord = useCallback(
    (time, index) => {
      time = +time + 0.05;
      let word = words[index];
      let nextWord = words[index + 1];
      // if (word) {
      //   console.log('comparing: ', time, '>', +word.end, time >= +word.end);
      // }
      if (index !== null && nextWord && time > +word.end) {
        let isShortTime = +word.end - word.start <= 0.05 && !isPlaying;
        if (!isShortTime && nextWord.deleted && nextWord.next !== null) {
          setCurrentWordIndex(nextWord.next);
        } else if (!isShortTime) {
          setCurrentWordIndex((prevState) => prevState + 1);
        }
      }
    },
    [isPlaying, words, setCurrentWordIndex]
  );

  const handleCurrentSub = useCallback(
    (time, index) => {
      time = +time + 0.05;
      let sub = subArr[index];
      let nextSub = subArr[index + 1];
      // if (word) {
      //   console.log('comparing: ', time, '>', +word.end, time >= +word.end);
      // }
      if (index !== null && nextSub && time > +sub.end) {
        if(!nextSub.deleted) setCurrentSubIndex((prevState) => prevState + 1);
        else setCurrentSubIndex(nextSub.nextSub);
      }
    },
    [subArr, setCurrentSubIndex]
  );

  useEffect(() => {
    if (isPlaying && currentSub && currentTime !== null) {
      handleCurrentSub(currentTime, currentSubIndex);
    }
  }, [isPlaying, currentSub, currentTime, handleCurrentSub, currentSubIndex]);

  useEffect(() => {
    if (currentTime !== null) handleCurrentWord(currentTime, currentWordIndex);
  }, [currentTime, handleCurrentWord, currentWordIndex]);

  useEffect(() => {
    if (currentTime !== null) handleVideoCuts(currentTime);
  }, [currentTime, handleVideoCuts]);
};

export default usePlayerTime;
