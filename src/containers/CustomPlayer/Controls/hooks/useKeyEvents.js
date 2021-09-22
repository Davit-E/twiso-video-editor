import { useEffect, useCallback } from 'react';

const useKeyEvents = (video, playPause, setVolume, setShouldShowPanel) => {
  const keydownHandler = useCallback(
    (e) => {
      if (document.activeElement.tagName === 'INPUT') e.preventDefault();
      let isSpace = e.code === 'Space' || e.key === 'Space';
      if (isSpace) {
        e.preventDefault();
        playPause();
      } else if (
        (e.code === 'ArrowLeft' || e.key === 'ArrowLeft') &&
        !e.shiftKey
      ) {
        video.currentTime = video.currentTime - 5;
      } else if (
        (e.code === 'ArrowRight' || e.key === 'ArrowRight') &&
        !e.shiftKey
      ) {
        video.currentTime = video.currentTime + 5;
      } else if ((e.code === 'ArrowUp' || e.key === 'ArrowUp') && !e.shiftKey) {
        e.preventDefault();
        setVolume((prevState) => {
          if (+prevState < 1)
            return Math.round((+prevState + 0.1) * 100) / 100 + '';
          else return prevState;
        });
      } else if (
        (e.code === 'ArrowDown' || e.key === 'ArrowDown') &&
        !e.shiftKey
      ) {
        e.preventDefault();
        setVolume((prevState) => {
          if (+prevState > 0)
            return Math.round((+prevState - 0.1) * 100) / 100 + '';
          else return prevState;
        });
      }
      if (!isSpace) setShouldShowPanel(true);
    },
    [video, playPause, setVolume, setShouldShowPanel]
  );

  useEffect(() => {
    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, [keydownHandler]);
};

export default useKeyEvents;
