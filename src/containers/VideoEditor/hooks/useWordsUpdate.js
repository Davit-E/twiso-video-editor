import { useEffect, useRef, useCallback } from 'react';

const useWordsUpdate = (
  isMounted,
  updateProject,
  info,
  words,
  dispatch,
  isDownloading,
  shouldUpdate,
  videoCuts
) => {
  const wordsUpdateTimerRef = useRef(null);
  const isFirstLoad = useRef(true);

  const triggerWordsUpdate = useCallback(() => {
    if (wordsUpdateTimerRef.current) clearTimeout(wordsUpdateTimerRef.current);
    let timeout = setTimeout(() => {
      if (isMounted.current) {
        wordsUpdateTimerRef.current = null;
        updateProject({
          id: info.id,
          transcription: [...words],
        });
      }
    }, 1000);
    wordsUpdateTimerRef.current = timeout;
  }, [updateProject, info, words, isMounted]);

  useEffect(() => {
    if (shouldUpdate) {
      dispatch({ type: 'setShouldTriggerWordsUpdate', data: false });
      if (!isDownloading) triggerWordsUpdate();
    }
  }, [triggerWordsUpdate, shouldUpdate, dispatch, isDownloading]);

  useEffect(() => {
    if (isFirstLoad.current) isFirstLoad.current = false;
    else if (words) {
      dispatch({ type: 'setShouldTriggerWordsUpdate', data: true });
    }
  }, [videoCuts, isDownloading, words, dispatch]);
};

export default useWordsUpdate;
