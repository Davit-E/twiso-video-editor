import { findSubIndexWithWordIndex } from '../utils/findIndex';

export const getPlayerSize = (playerRef, setPlayerSize) => {
  const playerPadding = 32;
  let width = window.innerWidth - playerRef.current.offsetLeft - playerPadding;
  let height = playerRef.current.offsetHeight;
  if (width > 800) {
    height = (height * 800) / width;
    width = 800;
  }
  setPlayerSize({ width, height });
  // setPlayerSize({ width: 640, height: 360 });
};

export const getDimensions = (videoRef, setVideoSize) => {
  let width = videoRef.current.videoWidth;
  let height = videoRef.current.videoHeight;
  setVideoSize({ width, height });
};

export const playClickHandler = (isPlaying, videoRef, state) => {
  if (isPlaying) videoRef.current.pause();
  else if (!state.isCropMode && !state.shouldCropImage) {
    videoRef.current.play();
  }
};

export const handlePlay = (
  currentSelection,
  setCurrentSelection,
  setIsPlaying,
  setCurrentTime,
  videoRef,
  setIntervalId
) => {
  let selection = document.getSelection();
  selection.removeAllRanges();
  if (currentSelection) setCurrentSelection(null);
  setIsPlaying(true);
  let interval = setInterval(() => {
    // console.log('interval: ', videoRef.current.currentTime);
    setCurrentTime(videoRef.current.currentTime);
  }, 10);
  setIntervalId(interval);
};

export const handlePause = (setIsPlaying, intervalId) => {
  setIsPlaying(false);
  clearInterval(intervalId);
};

export const handleEnd = (
  videoCuts,
  setNextCutIndex,
  words,
  setCurrentWordIndex,
  setCurrentTime,
  setCurrentSubIndex,
  subArr
) => {
  if (videoCuts.length > 0) setNextCutIndex(0);
  let word = words[0];
  let wordIndex = 0;
  let start = word.start;
  if (!word.active && word.next !== null) {
    wordIndex = word.next;
    start = words[wordIndex].start;
  }
  setCurrentWordIndex(wordIndex);
  let subIndex = findSubIndexWithWordIndex(wordIndex, words, subArr);
  // console.log(subIndex);
  setCurrentSubIndex(subIndex);
  setCurrentTime(+start);
  // console.log('start time: ', start);
  // console.log('start index: ', index);
  // console.log(words);
};
