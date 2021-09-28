import generateUUID from '../../../utils/generateRandomUUID';
import rgbaToHex from './rgbaToHex';

export const prepareBreaks = (cuts, endTime, setBreaks) => {
  let videoBreaks = [];
  let prev = null;
  for (let i = 0; i < cuts.length; i++) {
    let el = cuts[i];
    if (i === 0 && el.start !== 0) {
      videoBreaks.push({ start: 0, end: el.start });
    } else if (el.start !== 0) {
      videoBreaks.push({ start: prev, end: el.start });
    }
    prev = el.end;

    if (i === cuts.length - 1 && el.end !== endTime) {
      videoBreaks.push({ start: el.end, end: endTime });
    }
  }
  setBreaks(videoBreaks);
};


const getSubConfig = (object, subState) => {
  let zoom = object.canvas.getZoom();
  let width = object.canvas.getWidth() / zoom;
  let height = object.canvas.getHeight() / zoom;
  let x = (object.left * 100) / width;
  let y = (object.top * 100) / height;
  return {
    x,
    y,
    width,
    height,
    objectWidth: object.width,
    objectHeight: object.height,
    xCoordinate: object.left,
    yCoordinate: object.top,
    top: object.lineCoords.tl.y,
    left: object.lineCoords.tl.x,
    fontSize: subState.fontSize,
    fontColor: rgbaToHex(subState.fill),
    fontFamily: subState.fontFamily,
    backgroundColor: rgbaToHex(subState.backgroundColor),
    textAlign: 'center',
    padding: object.paddingY !== 0 ? object.paddingY / 2 : 0,
    fontWeight: subState.fontWeight,
    fontStyle: subState.fontStyle,
  };
}

export const prepareSubs = (subList, object, subState, setSubs) => {
  let config = getSubConfig(object, subState);
  console.log(config);
  // let prev = null;
  let deleteStart = 0;
  let deleteEnd = 0;
  let isLastDeleted = false;
  let captions = [];

  let subNode = subList.head;
  for (let i = 0; i < subList.length; i++) {
    let sub = subNode.val;
    if (sub.active && isLastDeleted) {
      let _id = generateUUID();
      isLastDeleted = false;
      captions.push({
        start: deleteStart,
        end: deleteEnd,
        active: false,
        silence: true,
        _id,
      });
    } else if (!sub.active && !isLastDeleted) {
      isLastDeleted = true;
      deleteStart = sub.start;
      deleteEnd = sub.end;
    } else if (!sub.active && isLastDeleted) {
      deleteEnd = sub.end;
    }

    if (sub.silence && sub.active) {
      let _id = generateUUID();
      captions.push({
        start: sub.start,
        end: sub.end,
        silence: true,
        _id,
        active: true,
      });
    } else if (sub.active) {
      let _id = generateUUID();
      let text = '';
      for (let i = 0; i < sub.words.length; i++) {
        let word = sub.words[i];
        text += word.text;
      }
      captions.push({
        start: sub.start,
        end: sub.end,
        text,
        silence: false,
        active: true,
        _id,
      });
    }
    subNode = subNode.next;
  }

  if (isLastDeleted) {
    let _id = generateUUID();
    captions.push({
      start: deleteStart,
      end: deleteEnd,
      active: false,
      silence: true,
      _id,
    });
  }
  let subtitles = { captions, config };
  console.log(subtitles);
  setSubs(subtitles);
};
