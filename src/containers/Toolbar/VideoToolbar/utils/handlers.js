export const initialLoadHandler = (videoState, setStroke, strokeRef) => {
  if (strokeRef.current && videoState.stroke !== null) {
    let [r, g, b, a] = videoState.stroke.split('(')[1].split(')')[0].split(',');
    setStroke({ r, g, b, a });
    strokeRef.current.style.background = videoState.stroke;
  }
};

export const strokeChangeCompleteHandler = (c, dispatch, strokeRef) => {
  if (strokeRef.current) {
    let colorString = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`;
    dispatch({ type: 'setVideoStroke', data: colorString });
    strokeRef.current.style.background = colorString;
  }
};

export const strokeWidthChangeHandler = (e, dispatch, setStrokeWidthInput) => {
  setStrokeWidthInput(e.target.value);
  let data = +e.target.value;
  if (data > 50) data = 50;
  else if (data < 0) data = 0;
  dispatch({ type: 'setVideoStrokeWidth', data });
};

export const handleClick = (
  clicked,
  setIsStrokeDropdown,
  setIsStrokeWidthDropdown
) => {
  if (clicked === 'stroke') {
    setIsStrokeDropdown((prevState) => !prevState);
    setIsStrokeWidthDropdown(false);
  } else if (clicked === 'strokeWidth') {
    setIsStrokeWidthDropdown((prevState) => !prevState);
    setIsStrokeDropdown(false);
  } else {
    setIsStrokeWidthDropdown(false);
    setIsStrokeDropdown(false);
  }
};
