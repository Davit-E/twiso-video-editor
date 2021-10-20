import { fabric } from 'fabric';

fabric.RectCropBox = fabric.util.createClass(fabric.Rect);

fabric.RectCropBox.prototype.setControlsVisibility({
  mtr: false
});