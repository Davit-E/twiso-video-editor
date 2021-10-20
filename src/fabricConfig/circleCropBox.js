import { fabric } from 'fabric';

fabric.CircleCropBox = fabric.util.createClass(fabric.Circle);

fabric.CircleCropBox.prototype.setControlsVisibility({
  mt: false,
  mb: false,
  ml: false,
  mr: false,
  mtr: false,
});
