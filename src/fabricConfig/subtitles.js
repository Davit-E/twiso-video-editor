import { fabric } from 'fabric';

// Subtitles renreding padding and border radius
// CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
//   if (w < 2 * r) r = w / 2;
//   if (h < 2 * r) r = h / 2;
//   this.beginPath();
//   this.moveTo(x + r, y);
//   this.arcTo(x + w, y, x + w, y + h, r);
//   this.arcTo(x + w, y + h, x, y + h, r);
//   this.arcTo(x, y + h, x, y, r);
//   this.arcTo(x, y, x + w, y, r);
//   this.closePath();
//   return this;
// };
fabric.Subtitle = fabric.util.createClass(fabric.IText, {
  type: 'subtitle',

  _getNonTransformedDimensions() {
    // Object dimensions
    return new fabric.Point(
      this.width + this.paddingX,
      this.height + this.paddingY
    );
  },

  _calculateCurrentDimensions() {
    // Controls dimensions
    return fabric.util.transformPoint(
      this._getTransformedDimensions(),
      this.getViewportTransform(),
      true
    );
  },

  // _renderBackground(ctx) {
  //   if (!this.backgroundColor) {
  //     return;
  //   }
  //   var dim = this._getNonTransformedDimensions();
  //   ctx.fillStyle = this.backgroundColor;

  //   if (!this.bgCornerRadius) {
  //     ctx.fillRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
  //   } else {
  //     ctx
  //       .roundRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y, this.bgCornerRadius)
  //       .fill();
  //   }
  //   // if there is background color no other shadows
  //   // should be casted
  //   this._removeShadow(ctx);
  // },
});

fabric.Subtitle.prototype.controls = {};

fabric.SubtitleWithResize = fabric.util.createClass(fabric.Textbox, {
  type: 'subtitle',

  _getNonTransformedDimensions() {
    // Object dimensions
    return new fabric.Point(
      this.width + this.paddingX,
      this.height + this.paddingY
    );
  },

  _calculateCurrentDimensions() {
    // Controls dimensions
    return fabric.util.transformPoint(
      this._getTransformedDimensions(),
      this.getViewportTransform(),
      true
    );
  },
});

fabric.SubtitleWithResize.prototype._wrapLine = function (
  _line,
  lineIndex,
  desiredWidth,
  reservedSpace
) {
  var lineWidth = 0,
    splitByGrapheme = this.splitByGrapheme,
    graphemeLines = [],
    line = [],
    // spaces in different languges?
    words = splitByGrapheme
      ? fabric.util.string.graphemeSplit(_line)
      : _line.split(this._wordJoiners),
    word = '',
    offset = 0,
    infix = splitByGrapheme ? '' : ' ',
    wordWidth = 0,
    infixWidth = 0,
    largestWordWidth = 0,
    lineJustStarted = true,
    additionalSpace = splitByGrapheme ? 0 : this._getWidthOfCharSpacing();

  reservedSpace = reservedSpace || 0;
  desiredWidth -= reservedSpace;

  if (words.length === 0) words.push([]);

  for (var i = 0; i < words.length; i++) {
    word = splitByGrapheme
      ? words[i]
      : fabric.util.string.graphemeSplit(words[i]);
    wordWidth = this._measureWord(word, lineIndex, offset);
    offset += word.length;

    // Break the line if a word is wider than the set width
    if (this.breakWords && wordWidth >= desiredWidth) {
      if (!lineJustStarted) {
        line.push(infix);
        lineJustStarted = true;
      }

      // Loop through each character in word
      for (var w = 0; w < word.length; w++) {
        var letter = word[w];
        var letterWidth =
          (this.getMeasuringContext().measureText(letter).width *
            this.fontSize) /
          this.CACHE_FONT_SIZE;
        if (lineWidth + letterWidth > desiredWidth) {
          graphemeLines.push(line);
          line = [];
          line.push(letter);
          lineWidth = letterWidth;
        } else {
          line.push(letter);
          lineWidth += letterWidth;
        }
      }
      word = [];
    } else {
      lineWidth += infixWidth + wordWidth - additionalSpace;
    }

    if (lineWidth >= desiredWidth && !lineJustStarted) {
      graphemeLines.push(line);
      line = [];
      lineWidth = wordWidth;
      lineJustStarted = true;
    } else {
      lineWidth += additionalSpace;
    }

    if (!lineJustStarted && !splitByGrapheme) {
      line.push(infix);
    }
    line = line.concat(word);

    infixWidth = splitByGrapheme
      ? 0
      : this._measureWord([infix], lineIndex, offset);
    offset++;
    lineJustStarted = false;
    // keep track of largest word
    if (wordWidth > largestWordWidth && !this.breakWords) {
      largestWordWidth = wordWidth;
    }
  }

  i && graphemeLines.push(line);

  if (largestWordWidth + reservedSpace > this.dynamicMinWidth) {
    this.dynamicMinWidth = largestWordWidth - additionalSpace + reservedSpace;
  }

  return graphemeLines;
};