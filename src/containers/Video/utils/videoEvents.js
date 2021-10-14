import { findSubWithWordIndex } from '../../../utils/findIndex';

export const handlePlay = (
  currentSelection,
  setCurrentSelection,
  setIsPlaying,
  setCurrentTime,
  videoRef,
  setIntervalId,
  words
) => {
  setIsPlaying(true);
  if (words) {
    let selection = document.getSelection();
    selection.removeAllRanges();
    if (currentSelection) setCurrentSelection(null);
    let interval = setInterval(() => {
      // console.log('interval: ', videoRef.current.currentTime);
      if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
    }, 10);
    setIntervalId(interval);
  }
};

export const handlePause = (setIsPlaying, intervalId, words) => {
  setIsPlaying(false);
  if (words) clearInterval(intervalId);
};

export const handleEnd = (
  videoCuts,
  setNextCutIndex,
  words,
  setCurrentWordIndex,
  setCurrentTime,
  setCurrentSub,
  subList
) => {
  if (words) {
    if (videoCuts.length > 0) setNextCutIndex(0);
    let word = words[0];
    let wordIndex = 0;
    let start = word.start;
    if (!word.active && word.next !== null) {
      wordIndex = word.next;
      start = words[wordIndex].start;
    }
    setCurrentWordIndex(wordIndex);
    let sub = findSubWithWordIndex(wordIndex, words, subList);
    setCurrentSub(sub);
    setCurrentTime(+start);
  }
};
