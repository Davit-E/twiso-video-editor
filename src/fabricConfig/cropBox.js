import { fabric } from 'fabric';

fabric.CropBox = fabric.util.createClass(fabric.Rect);

fabric.CropBox.prototype.setControlsVisibility({
  mtr: false
});