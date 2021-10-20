import { useEffect, useCallback, useState } from 'react';
import { restrictBox, prepareMediaForCrop, cropMedia } from '../utils/crop';

const useCropMedia = (state, dispatch, canvas) => {
  const [isCropping, setIsCropping] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [activeEl, setAcitveEl] = useState(null);
  const [cropbox, setCropbox] = useState(null);
  const [croppedMedia, setCroppedMedia] = useState(null);

  const cropFinishHandler = useCallback(
    (c, box, dispatch, obj, cropType, info, wasCropped) => {
      c.getObjects().forEach((el) => {
        if (el.type === 'cropbox') c.remove(el);
        el.selectable = true;
      });
      for (let [key, value] of Object.entries(info)) {
        obj[key] = value;
      }
      c.setActiveObject(obj);
      let type = obj.type;
      if (cropType === 'circle' && wasCropped) obj.cornerRadius = 100;

      dispatch({
        type: 'setCurrentObject',
        data: { type, object: obj },
      });

      if (obj.cornerRadius > 0) {
        obj.strokeWidth = 0;
        dispatch({
          type:
            type === 'video' ? 'setVideoCornerRadius' : 'setImageCornerRadius',
          data: obj.cornerRadius,
        });
      } else if (type === 'video') {
        dispatch({
          type: 'setVideoStrokeWidth',
          data: obj.strokeWidth,
        });
      }

      setActiveInfo(null);
      setIsCropping(false);
      setAcitveEl(null);
      setCropbox(null);
      setCroppedMedia(null);
      box.off('moving');
      box.off('scaling');
      c.off('mouse:down');
      c.requestRenderAll();
      dispatch({ type: 'setShouldCropMedia', data: false });
      dispatch({ type: 'setShowToolbar', data: true });
    },
    []
  );

  // Crop Media
  useEffect(() => {
    if (state.shouldCropMedia && activeEl && cropbox) {
      cropMedia(activeEl, cropbox, setCroppedMedia);
    }
  }, [state.shouldCropMedia, activeEl, cropbox]);

  // If Cropped Media or Dispose of Crop
  useEffect(() => {
    if (croppedMedia && state.shouldCropMedia) {
      dispatch({ type: 'setIsCropMode', data: false });
      cropFinishHandler(
        canvas,
        cropbox,
        dispatch,
        croppedMedia,
        state.cropType,
        activeInfo,
        true
      );
    } else if (isCropping && !state.isCropMode && !state.shouldCropMedia) {
      cropFinishHandler(
        canvas,
        cropbox,
        dispatch,
        activeEl,
        state.cropType,
        activeInfo,
        false
      );
    }
  }, [
    cropbox,
    activeInfo,
    croppedMedia,
    state,
    dispatch,
    canvas,
    cropFinishHandler,
    isCropping,
    activeEl,
  ]);

  /// Preparation For Crop
  useEffect(() => {
    if (state.isCropMode) {
      let active = canvas.getActiveObject();
      setActiveInfo({
        cornerRadius: active.cornerRadius,
        top: active.top,
        left: active.left,
        angle: active.angle,
        strokeWidth: active.strokeWidth,
      });
      prepareMediaForCrop(
        active,
        dispatch,
        canvas,
        setAcitveEl,
        setCropbox,
        state.cropType
      );
    }
  }, [state.isCropMode, state.cropType, canvas, dispatch]);

  /// If Cropbox and Active El start Crop
  useEffect(() => {
    if (cropbox && activeEl) {
      restrictBox(activeEl, cropbox);
      setIsCropping(true);
    }
  }, [cropbox, activeEl]);

  // Listen to Canvas Click
  useEffect(() => {
    if (cropbox && state.isCropMode) {
      canvas.on('mouse:down', (e) => {
        if (e.target && e.target.id === activeEl.id) {
          canvas.setActiveObject(cropbox);
        } else if (!e.target || e.target.type !== 'cropbox') {
          dispatch({ type: 'setShouldCropMedia', data: true });
          dispatch({ type: 'setShowToolbar', data: false });
        }
      });
    }
  }, [cropbox, state, dispatch, canvas, activeEl]);
};

export default useCropMedia;
