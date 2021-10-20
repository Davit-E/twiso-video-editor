import { fabric } from 'fabric';

fabric.Video = fabric.util.createClass(fabric.Image, {
  type: 'video',
  cropRect: null,
  id: null,
  cornerRadius: 0,

  initialize: function (video, options) {
    const defaultOpts = {
      lockRotation: true,
      objectCaching: true,
      lockScalingFlip: true,
      strokeUniform: true,
      cacheProperties: ['time'],
    };
    options = options || {};

    this.callSuper(
      'initialize',
      video,
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

  // _stroke: function (ctx) {
  //   if (!this.stroke || this.strokeWidth === 0) {
  //     return;
  //   }
  //   var w = this.width / 2,
  //     h = this.height / 2;
  //   ctx.beginPath();
  //   ctx.moveTo(-w, -h);
  //   ctx.lineTo(w, -h);
  //   ctx.lineTo(w, h);
  //   ctx.lineTo(-w, h);
  //   ctx.lineTo(-w, -h);
  //   ctx.closePath();
  // },

  _render: function (ctx) {
    this._draw(this.getElement(), ctx);
    this._stroke(ctx);
    this._renderPaintInOrder(ctx);
  },
});

fabric.Video.prototype.setControlsVisibility({
  tl: true,
  tr: true,
  bl: true,
  br: true,
  mtr: false,
});

fabric.Video.fromObject = function (object, callback) {
  return fabric.Object._fromObject(
    'Video',
    object,
    callback,
    'type',
    'cropRect',
    'id'
  );
};