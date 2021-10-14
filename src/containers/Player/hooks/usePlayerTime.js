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
  currentSub,
  setCurrentSub,
  fabricSub
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
        if (!isShortTime && !nextWord.active && nextWord.next !== null) {
          setCurrentWordIndex(nextWord.next);
        } else if (!isShortTime) {
          setCurrentWordIndex((prevState) => prevState + 1);
        }
      }
    },
    [isPlaying, words, setCurrentWordIndex]
  );

  const handleCurrentSub = useCallback(
    (time, sub) => {
      time = +time + 0.05;
      let nextSub = sub.next;
      // if (word) {
      //   console.log('comparing: ', time, '>', +word.end, time >= +word.end);
      // }
      if (sub && nextSub && time > +sub.val.end) {
        if (nextSub.val.active) setCurrentSub((prevState) => prevState.next);
        else setCurrentSub(nextSub.nextSub);
      }
    },
    [setCurrentSub]
  );

  useEffect(() => {
    if (words && isPlaying && fabricSub && currentSub && currentTime !== null) {
      handleCurrentSub(currentTime, currentSub);
    }
  }, [words, isPlaying, fabricSub, currentTime, handleCurrentSub, currentSub]);

  useEffect(() => {
    if (words && currentTime !== null)
      handleCurrentWord(currentTime, currentWordIndex);
  }, [words, currentTime, handleCurrentWord, currentWordIndex]);

  useEffect(() => {
    if (words && currentTime !== null) handleVideoCuts(currentTime);
  }, [words, currentTime, handleVideoCuts]);
};

export default usePlayerTime;
