import { useEffect, useContext } from 'react';
import { addSpeaker } from '../utils/crop';
import SpeakersContext from '../../../contexts/SpeakersContext';

const useCropVideo = (
  canvas,
  isCanvasSet,
  video,
  boxArr,
  setBoxArr,
  boxId,
  updateBoxId
) => {
  const { speakersState, speakersDispatch } = useContext(SpeakersContext);

  // useEffect(() => {
  //   if (video) {
  //     setBoxSize({
  //       width: video.width,
  //       height: video.height,
  //       scaleX: video.scaleX / 2,
  //       scaleY: video.scaleY / 2,
  //     });
  //   }
  // }, [video]);
  // const [currentBox, setCurrentBox] = useState(null);

  // const onUpdated = useCallback((e) => {
  //   setCurrentBox(e.target);
  // }, []);

  // const onCleared = useCallback(
  //   (e) => {
  //     if (currentBox) {
  //       console.log(e.deselected[0].lineCoords);
  //       console.log(e.deselected[0].scaleX);
  //       console.log(e.deselected[0].scaleY);
  //       console.log(canvas.getZoom());
  //       canvas.setActiveObject(currentBox);
  //     }
  //   },
  //   [canvas, currentBox]
  // );

  // const removeListeners = useCallback(() => {
  //   canvas.off('selection:updated', onUpdated);
  //   // canvas.off('selection:cleared', onCleared);
  // }, [canvas, onUpdated]);

  // useEffect(() => {
  //   if (isCanvasSet) {
  //     canvas.on('selection:updated', onUpdated);
  //     // canvas.on('selection:cleared', onCleared);
  //   }
  //   return () => {
  //     if (isCanvasSet) removeListeners(canvas);
  //   };
  // }, [canvas, isCanvasSet, onUpdated, removeListeners]);

  // Handle Speaker Adding
  useEffect(() => {
    if (video && speakersState.shouldAddSpeaker) {
      speakersDispatch({ type: 'setShouldAddSpeaker', data: false });
      addSpeaker(boxArr, boxId, canvas, setBoxArr, updateBoxId, video);
    }
  }, [
    boxArr,
    speakersState,
    speakersDispatch,
    canvas,
    video,
    setBoxArr,
    boxId,
    updateBoxId,
  ]);

  // Handle Speaker Removing
  useEffect(() => {
    if (video && speakersState.shouldRemoveSpeaker) {
      speakersDispatch({ type: 'setShouldRemoveSpeaker', data: false });
      let active = canvas.getActiveObject();
      if (active) {
        canvas.remove(active);
        setBoxArr((prevState) =>
          prevState.filter((box) => box.id !== active.id)
        );
        canvas.requestRenderAll();
      }
    }
  }, [speakersState, speakersDispatch, canvas, video, setBoxArr]);
};

export default useCropVideo;
