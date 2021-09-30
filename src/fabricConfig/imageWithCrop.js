import { fabric } from 'fabric';

fabric.ImageWithCrop = fabric.util.createClass(fabric.Image, {
  type: 'image',
  cropRect: null,
  cornerRadius: 0,

  initialize: function (video, options) {
    options = options || {};
    this.callSuper('initialize', video, Object.assign({}, options));
  },

  _draw: function (video, ctx, w, h) {
    const c = this.cropRect;
    const d = {
      x: -this.width / 2,
      y: -this.height / 2,
      w: this.width,
      h: this.height,
    };
    if (c) {
      ctx.drawImage(video, c.x, c.y, c.w, c.h, d.x, d.y, d.w, d.h);
    } else {
      ctx.drawImage(video, d.x, d.y, d.w, d.h);
    }
  },

  toObject: function (options) {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.get('type'),
      cropRect: this.get('cropRect'),
      id: this.get('id'),
      cornerRadius: this.get('cornerRadius'),
    });
  },

  _render: function (ctx) {
    this._draw(this.getElement(), ctx);
  },
});

fabric.ImageWithCrop.fromURL = function (url, callback, imgOptions) {
  fabric.util.loadImage(
    url,
    function (img, isError) {
      callback && callback(new fabric.ImageWithCrop(img, imgOptions), isError);
    },
    null,
    imgOptions && imgOptions.crossOrigin
  );
};

fabric.ImageWithCrop.fromObject = function (object, callback) {
  return fabric.Object._fromObject(
    'Image',
    object,
    callback,
    'type',
    'cropRect',
    'cornerRadius',
    'id'
  );
};
