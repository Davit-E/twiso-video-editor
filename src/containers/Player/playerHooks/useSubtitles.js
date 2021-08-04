import { useEffect } from 'react';
import {
  newSubtitle,
  generateSubtitles,
  displaySub,
} from '../utils/subtitle.js';
import { findSubIndexWithWordIndex } from '../../utils/findIndex';

const useSubtitles = (
  state,
  canvas,
  currentSub,
  setCurrentSub,
  words,
  subArr,
  setSubArr,
  currentSubIndex,
  setCurrentSubIndex,
  currentWordIndex,
  videoCuts,
  shouldRerenderSub,
  setShouldRerenderSub,
  isPlaying,
  videoRef
) => {

  useEffect(() => {
    if (currentSub && subArr && subArr[currentSubIndex]) {
      if (shouldRerenderSub) setShouldRerenderSub(false);
      displaySub(currentSub, currentSubIndex, subArr);
    }
  }, [
    subArr,
    currentSub,
    currentSubIndex,
    shouldRerenderSub,
    setShouldRerenderSub,
  ]);

  useEffect(() => {
    if (subArr && !isPlaying) {
      let subIndex = findSubIndexWithWordIndex(currentWordIndex, words, subArr);
      if (subIndex !== null) setCurrentSubIndex(subIndex);
    }
  }, [
    subArr,
    setCurrentSubIndex,
    words,
    currentWordIndex,
    isPlaying,
  ]);

  useEffect(() => {
    if (currentSub && videoCuts) {
      generateSubtitles(words, setSubArr);
    }
  }, [currentSub, videoCuts, setSubArr, words]);

  useEffect(() => {
    if (canvas && !currentSub && state.isSubtitles) {
      if (isPlaying) videoRef.current.pause();
      let sub = newSubtitle(canvas, state);
      // console.log('added: ', sub);
      canvas.add(sub);
      canvas.requestRenderAll();
      setCurrentSub(sub);
    } else if (currentSub && !state.isSubtitles) {
      canvas.remove(currentSub);
      setCurrentSub(null);
    }
  }, [
    videoRef,
    isPlaying,
    state.isSubtitles,
    currentSub,
    setCurrentSub,
    canvas,
    state,
    subArr,
    words,
    setSubArr,
  ]);

  useEffect(() => {
    if (canvas && currentSub) {
      canvas.on('object:added', (e) => {
        canvas.bringToFront(currentSub);
      });
    }
    return () => {
      if (canvas) canvas.off('object:added');
    };
  }, [canvas, currentSub]);
};

export default useSubtitles;
