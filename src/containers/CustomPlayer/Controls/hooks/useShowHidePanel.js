import { useCallback, useEffect, useRef, useState } from 'react';

const useShowHidePanel = (
  isPlaying,
  controlsRef,
  panelRef,
  visible,
  hover,
  shouldShowPanel,
  setShouldShowPanel
) => {
  const [isCursorOnPanel, setIsCursorOnPanel] = useState(false);
  const isMounted = useRef(false);
  const hovertimerRef = useRef(null);
  const visibletimerRef = useRef(null);

  const startTimeout = useCallback((timerRef, ref, style) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      if (isMounted.current) {
        ref.current.classList.remove(style);
        timerRef.current = null;
      }
    }, 3000);
  }, []);

  const mouseMoveHanlder = useCallback(() => {
    controlsRef.current.classList.add(hover);
    if (isPlaying && !isCursorOnPanel) {
      startTimeout(hovertimerRef, controlsRef, hover);
    } else if (isPlaying && isCursorOnPanel) {
      if (hovertimerRef.current) {
        clearTimeout(hovertimerRef.current);
        hovertimerRef.current = null;
      }
    }
  }, [isPlaying, isCursorOnPanel, controlsRef, startTimeout, hover]);

  const mouseEnterHandler = useCallback(() => setIsCursorOnPanel(true), []);
  const mouseLeaveHandler = useCallback(() => setIsCursorOnPanel(false), []);

  useEffect(() => {
    controlsRef.current.classList.add(hover);
  }, [controlsRef, hover]);

  useEffect(() => {
    if (!isPlaying) {
      controlsRef.current.classList.add(visible);
      controlsRef.current.classList.add(hover);
    } else {
      controlsRef.current.classList.remove(visible);
      if (!isCursorOnPanel) startTimeout(hovertimerRef, controlsRef, hover);
    }
  }, [isPlaying, controlsRef, visible, startTimeout, hover, isCursorOnPanel]);

  useEffect(() => {
    if (isPlaying && shouldShowPanel && !isCursorOnPanel) {
      setShouldShowPanel(false);
      controlsRef.current.classList.add(visible);
      startTimeout(visibletimerRef, controlsRef, visible);
    } else setShouldShowPanel(false);
  }, [
    controlsRef,
    hover,
    shouldShowPanel,
    setShouldShowPanel,
    visible,
    startTimeout,
    isPlaying,
    isCursorOnPanel,
  ]);

  useEffect(() => {
    let controls = controlsRef.current;
    let panel = panelRef.current;
    controls.addEventListener('mousemove', mouseMoveHanlder);
    panel.addEventListener('mouseenter', mouseEnterHandler);
    panel.addEventListener('mouseleave', mouseLeaveHandler);
    return () => {
      controls.removeEventListener('mousemove', mouseMoveHanlder);
      panel.removeEventListener('mouseenter', mouseEnterHandler);
      panel.removeEventListener('mouseleave', mouseLeaveHandler);
    };
  }, [
    controlsRef,
    panelRef,
    mouseMoveHanlder,
    mouseEnterHandler,
    mouseLeaveHandler,
  ]);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
};

export default useShowHidePanel;
