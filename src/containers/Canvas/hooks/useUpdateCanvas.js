import { useEffect } from 'react';
import { updateCanvasSize, updateCanvasStyle } from '../utils/updateCanvas';

const useUpdateCanvas = (state, dispatch, canvas) => {
  useEffect(() => {
    if (state.shouldUpdateCanvas) updateCanvasStyle(state, canvas, dispatch);
    if (state.shouldUpdateCanvasSize) updateCanvasSize(state, canvas, dispatch);
  }, [state, dispatch, canvas]);
};

export default useUpdateCanvas;
