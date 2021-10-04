import { fabric } from 'fabric';

fabric.CustomImage = fabric.util.createClass(fabric.Image, {
  type: 'customImage',
  cropRect: null,
  id: null,
  cornerRadius: 0,

  initialize: function (customImage, options) {
    const defaultOpts = {
      objectCaching: true,
      crossOrigin: 'Anonymous' 
    };
    options = options || {};

    this.callSuper(
      'initialize',
      customImage,
      Object.assign({}, defaultOpts, options)
    );
  },

  toObject: function (options) {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      type: this.get('type'),
      cropRect: this.get('cropRect'),
      id: this.get('id'),
      cornerRadius: this.get('cornerRadius'),
    });
  },

  _draw: function (customImage, ctx, w, h) {
    const c = this.cropRect;
    const d = {
      x: -this.width / 2,
      y: -this.height / 2,
      w: this.width,
      h: this.height,
    };
    if (c) {
      ctx.drawImage(customImage, c.x, c.y, c.w, c.h, d.x, d.y, d.w, d.h);
    } else {
      ctx.drawImage(customImage, d.x, d.y, d.w, d.h);
    }
  },

  _render: function (ctx) {
    this._draw(this.getElement(), ctx);
  },
});

fabric.CustomImage.fromURL = function (url, callback, imgOptions) {
  fabric.util.loadImage(
    url,
    function (img, isError) {
      callback && callback(new fabric.CustomImage(img, imgOptions), isError);
    },
    null,
    imgOptions && imgOptions.crossOrigin
  );
};

fabric.CustomImage.fromObject = function(_object, callback) {
  var object = fabric.util.object.clone(_object);
  fabric.util.loadImage(object.src, function(img, isError) {
    if (isError) {
      callback && callback(null, true);
      return;
    }
    fabric.CustomImage.prototype._initFilters.call(object, object.filters, function(filters) {
      object.filters = filters || [];
      fabric.CustomImage.prototype._initFilters.call(object, [object.resizeFilter], function(resizeFilters) {
        object.resizeFilter = resizeFilters[0];
        fabric.util.enlivenObjects([object.clipPath], function(enlivedProps) {
          object.clipPath = enlivedProps[0];
          var image = new fabric.CustomImage(img, object);
          callback(image, false);
        });
      });
    });
  }, null, object.crossOrigin);
};
