import { useEffect } from 'react';
import { generateSubtitles } from '../utils/generateSubtitles';
import { newSubtitle, displaySub } from '../utils/subtitle.js';
import { findSubWithWordIndex } from '../../../utils/findIndex';

const useSubtitles = (
  state,
  canvas,
  fabricSub,
  setFabricSub,
  words,
  subList,
  setSubList,
  currentSub,
  setCurrentSub,
  currentWordIndex,
  videoCuts,
  shouldRerenderSub,
  setShouldRerenderSub,
  isPlaying,
  videoRef
) => {
  useEffect(() => {
    if (fabricSub && currentSub) {
      if (shouldRerenderSub) setShouldRerenderSub(false);
      displaySub(fabricSub, currentSub);
    }
  }, [fabricSub, currentSub, shouldRerenderSub, setShouldRerenderSub, subList]);

  useEffect(() => {
    if (subList && !isPlaying) {
      let sub = findSubWithWordIndex(currentWordIndex, words, subList);
      if (sub !== null) setCurrentSub(sub);
    }
  }, [subList, setCurrentSub, words, currentWordIndex, isPlaying]);

  useEffect(() => {
    if (fabricSub && videoCuts) {
      generateSubtitles(words, setSubList);
    }
  }, [fabricSub, videoCuts, setSubList, words]);

  useEffect(() => {
    if (canvas && !fabricSub && state.isSubtitles) {
      if (isPlaying) videoRef.current.pause();
      let sub = newSubtitle(canvas, state);
      canvas.add(sub);
      canvas.requestRenderAll();
      setFabricSub(sub);
    } else if (fabricSub && !state.isSubtitles) {
      canvas.remove(fabricSub);
      setFabricSub(null);
    }
  }, [
    videoRef,
    isPlaying,
    state.isSubtitles,
    fabricSub,
    setFabricSub,
    canvas,
    state,
    subList,
    words,
    setSubList,
  ]);

  useEffect(() => {
    if (canvas && fabricSub) {
      canvas.on('object:added', (e) => {
        canvas.bringToFront(fabricSub);
      });
    }
    return () => {
      if (canvas) canvas.off('object:added');
    };
  }, [canvas, fabricSub]);
};

export default useSubtitles;
