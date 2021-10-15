import { useEffect, useContext, useState } from 'react';
import { addSpeaker, handleFirstLoadSpeakers } from '../utils/crop';
import SpeakersContext from '../../../contexts/SpeakersContext';

const useCropSpeakers = (
  canvas,
  video,
  boxArr,
  setBoxArr,
  boxId,
  updateBoxId,
  speakers,
  isCanvasSet
) => {
  const { speakersState, speakersDispatch } = useContext(SpeakersContext);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Handle Speaker Adding On First Load
  useEffect(() => {
    if (video && isCanvasSet && isFirstLoad) {
      setIsFirstLoad(false);
      if (speakers.length > 0) {
        handleFirstLoadSpeakers(
          canvas,
          setBoxArr,
          updateBoxId,
          video,
          speakers
        );
      } else speakersDispatch({ type: 'setShouldAddSpeaker', data: true });
    }
  }, [
    canvas,
    setBoxArr,
    updateBoxId,
    isFirstLoad,
    video,
    speakers,
    isCanvasSet,
    speakersDispatch,
  ]);

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

export default useCropSpeakers;
