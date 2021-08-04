import { useEffect, useState } from 'react';
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
) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad && currentSub && subArr) {
      setIsFirstLoad(false);
      let subIndex = findSubIndexWithWordIndex(currentWordIndex, words, subArr);
      if (subIndex !== null) setCurrentSubIndex(subIndex);
    } else if (currentSub && subArr && subArr[currentSubIndex]) {
      if(shouldRerenderSub) setShouldRerenderSub(false)
      displaySub(currentSub, currentSubIndex, subArr);
    }
  }, [
    currentWordIndex,
    words,
    subArr,
    setCurrentSubIndex,
    isFirstLoad,
    currentSub,
    currentSubIndex,
    shouldRerenderSub,
    setShouldRerenderSub
  ]);

  // useEffect(() => {
  //   if(currentSub && videoCuts) {
  //     generateSubtitles(words, setSubArr);
  //   }
  // }, [currentSub, videoCuts, setSubArr, words])

  useEffect(() => {
    if (canvas && !currentSub && state.isSubtitles) {
      let sub = newSubtitle(canvas, state);
      console.log('added: ', sub);
      canvas.add(sub);
      canvas.requestRenderAll();
      setCurrentSub(sub);
      generateSubtitles(words, setSubArr);
    } else if (currentSub && !state.isSubtitles) {
      canvas.remove(currentSub);
      setCurrentSub(null);
    }
  }, [
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
      setIsFirstLoad(true);
    };
  }, [canvas, currentSub]);
};

export default useSubtitles;
