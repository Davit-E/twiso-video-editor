import { useEffect, useCallback, useState } from 'react';
import { restrictBox, prepareForImageCrop, cropImage } from '../utils/crop';

const useCropImage = (state, dispatch, canvas, idCount, updatetId) => {
  const [isCropping, setIsCropping] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null);
  const [activeEl, setAcitveEl] = useState(null);
  const [cropbox, setCropbox] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const cropFinishHandler = useCallback((c, box, dispatch) => {
    setActiveInfo(null);
    setIsCropping(false);
    setAcitveEl(null);
    setCropbox(null);
    setCroppedImage(null);
    box.off('moving');
    box.off('scaling');
    c.off('mouse:down');
    c.requestRenderAll();
    dispatch({ type: 'setShouldCropImage', data: false });
    dispatch({ type: 'setShowToolbar', data: true });
  }, []);

  useEffect(() => {
    if (state.shouldCropImage && activeEl && cropbox) {
      cropImage(activeEl, cropbox, setCroppedImage);
    }
  }, [state.shouldCropImage, activeEl, cropbox]);

  // If Cropped Image
  useEffect(() => {
    if (croppedImage && state.shouldCropImage) {
      croppedImage.controls.mtr.visible = true;
      canvas.getObjects().forEach((el) => {
        if (el.type === 'cropbox') canvas.remove(el);
        else if (el.id !== 'background') el.selectable = true;
      });
      for (let [key, value] of Object.entries(activeInfo)) {
        croppedImage[key] = value;
      }
      croppedImage.id = idCount;
      updatetId();
      canvas.remove(activeEl);
      dispatch({
        type: 'setCurrentObject',
        data: { type: 'image', data: croppedImage },
      });
      dispatch({
        type: 'setImageCornerRadius',
        data: activeInfo.cornerRadius,
      });
      canvas.add(croppedImage).setActiveObject(croppedImage);
      dispatch({
        type: 'setCurrentCoords',
        data: croppedImage.lineCoords,
      });
      dispatch({ type: 'setIsCropMode', data: false });
      cropFinishHandler(canvas, cropbox, dispatch);
    }
  }, [
    idCount,
    updatetId,
    activeEl,
    cropbox,
    activeInfo,
    croppedImage,
    state,
    dispatch,
    canvas,
    cropFinishHandler,
  ]);

  /// Preparation For Crop
  useEffect(() => {
    if (state.isCropMode) {
      let active = canvas.getActiveObject();
      setActiveInfo({
        id: active.id,
        cornerRadius: active.cornerRadius,
        top: active.top,
        left: active.left,
        angle: active.angle,
      });
      prepareForImageCrop(active, dispatch, canvas, setAcitveEl, setCropbox);
    }
  }, [state.isCropMode, canvas, dispatch]);

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
        if (e.target && e.target.id === activeInfo.id) {
          canvas.setActiveObject(cropbox);
        } else if (!e.target || e.target.type !== 'cropbox') {
          dispatch({ type: 'setShouldCropImage', data: true });
          dispatch({ type: 'setShowToolbar', data: false });
        }
      });
    }
  }, [cropbox, state, dispatch, canvas, activeInfo]);

  // Dispose of Crop
  useEffect(() => {
    if (isCropping && !state.isCropMode && !state.shouldCropImage) {
      canvas.getObjects().forEach((el) => {
        if (el.type === 'cropbox') canvas.remove(el);
        else if (el.id === state.currentObject.object.id) {
          canvas.setActiveObject(el);
          el.left = activeInfo.left;
          el.top = activeInfo.top;
          el.angle = activeInfo.angle;
        }
        el.controls.mtr.visible = true;
        el.selectable = true;
      });
      cropFinishHandler(canvas, cropbox, dispatch);
    }
  }, [
    activeInfo,
    isCropping,
    state,
    cropFinishHandler,
    canvas,
    dispatch,
    cropbox,
  ]);
};

export default useCropImage;
