import { useEffect } from 'react';
import {
  updateImageStyle,
  updateTextStyle,
  updateShapeStyle,
  updateSubtitlesStyle
} from '../utils/updateObject';

const shapeArr = ['rect', 'circle', 'triangle', 'line'];

const useUpdateObject = (state, dispatch, canvas) => {
  useEffect(() => {
    if (state.shouldUpdateSubtitles) {
      updateSubtitlesStyle(state, canvas, dispatch)
    }
    if (state.shouldUpdateText && state.currentObject.type === 'text') {
      updateTextStyle(state, canvas, dispatch);
    }
    if (
      state.shouldUpdateShape &&
      shapeArr.includes(state.currentObject.type)
    ) {
      updateShapeStyle(state, canvas, dispatch);
    }
    if (state.shouldUpdateImage && state.currentObject.type === 'image') {
      updateImageStyle(state, canvas, dispatch);
    }
  }, [state, dispatch, canvas]);
};

export default useUpdateObject;
