const rgba2hex = (color) => {
  let rgb = color
      .replace(/\s/g, '')
      .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = ((rgb && rgb[4]) || '').trim(),
    hex = rgb
      ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
        (rgb[2] | (1 << 8)).toString(16).slice(1) +
        (rgb[3] | (1 << 8)).toString(16).slice(1)
      : color;

  let a = alpha !== '' ? alpha : '01'
  
  a = ((+a * 255) | (1 << 8)).toString(16).slice(1);
  hex = '#' + hex + a;
  return hex;
};

export default rgba2hex;
