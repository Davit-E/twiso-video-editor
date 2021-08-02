export const colorChangeCompleteHandler = (c, ref, dispatch, isSub, isBg) => {
  let colorString = `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`;
  if (isBg && ref.current) {
    ref.current.style.background = colorString;
    dispatch({ type: 'setSubtitlesbackgroundColor', data: colorString });
  } else if (ref.current) {
    let type = isSub ? 'setSubtitlesTextFill' : 'setTextFill';
    ref.current.style.background = colorString;
    dispatch({ type, data: colorString });
  }
};

export const handleClick = (e, dropdownHandlers, styleHandlers) => {
  if (e.currentTarget.id === 'bold' || e.currentTarget.id === 'italic') {
    styleHandlers[e.currentTarget.id]();
  }
  for (let [id, handler] of Object.entries(dropdownHandlers)) {
    if (id === e.currentTarget.id) handler((prevState) => !prevState);
    else handler(false);
  }
};

export const fontSizeChangeHandler = (e, setFontSizeInput, dispatch, isSub) => {
  setFontSizeInput(e.target.value);
  let data = +e.target.value;
  if (data <= 0) data = 1;
  else if (data > 1080) data = 1080;
  let type = isSub ? 'setSubtitlesFontSize' : 'setFontSize';
  dispatch({ type, data });
};
