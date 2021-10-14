import { useEffect, useContext } from 'react';
import { addSpeaker } from '../utils/crop';
import SpeakersContext from '../../../contexts/SpeakersContext';

const useCropSpeakers = (
  canvas,
  video,
  boxArr,
  setBoxArr,
  boxId,
  updateBoxId
) => {
  const { speakersState, speakersDispatch } = useContext(SpeakersContext);

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
