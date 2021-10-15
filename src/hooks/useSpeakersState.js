import { useReducer } from 'react';

const initialState = {
  initialWidth: 0,
  initialHeight: 0,
  width: 0,
  height: 0,
  shouldUpdateCanvas: false,
  shouldUpdateCanvasSize: false,
  shouldAddSpeaker: false,
  shouldRemoveSpeaker: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setCanvasSize':
      return {
        ...state,
        shouldUpdateCanvasSize: true,
        width: action.data.width,
        height: action.data.height,
      };
    case 'setCanvasInitialSize':
      return {
        ...state,
        initialWidth: action.data.initialWidth,
        initialHeight: action.data.initialHeight,
        width: action.data.width,
        height: action.data.height,
      };
    case 'setShouldUpdateCanvas':
      return { ...state, shouldUpdateCanvas: action.data };
    case 'setShouldUpdateCanvasSize':
      return { ...state, shouldUpdateCanvasSize: action.data };
    case 'setShouldAddSpeaker':
      return { ...state, shouldAddSpeaker: action.data };
    case 'setShouldRemoveSpeaker':
      return { ...state, shouldRemoveSpeaker: action.data };
    default:
      return state;
  }
};

const useSpeakersState = () => {
  const [speakerState, speakerDispatch] = useReducer(reducer, initialState);
  return [speakerState, speakerDispatch];
};

export default useSpeakersState;
