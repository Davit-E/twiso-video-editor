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

export const prepareSubs = (arr, object, subState, setSubs) => {
  let zoom = object.canvas.getZoom();
  let width = object.canvas.getWidth() / zoom;
  let height = object.canvas.getHeight() / zoom;
  let x = (object.left * 100) / width;
  let y = (object.top * 100) / height;
  let captions = [];
  let config = {
    x,
    y,
    fontSize: subState.fontSize,
    fontColor: rgbaToHex(subState.fill),
    fontFamily: subState.fontFamily,
    backgroundColor: rgbaToHex(subState.backgroundColor),
    textAlign: 'center',
    padding: object.paddingY !== 0 ? object.paddingY / 2 : 0,
    fontWeight: subState.fontWeight,
    fontStyle: subState.fontStyle,
  };
  // console.log(config);
  // let prev = null;
  let deleteStart = 0;
  let deleteEnd = 0;
  let isLastDeleted = false;
  for (let i = 0; i < arr.length; i++) {
    let el = arr[i];
    if (el.active && isLastDeleted) {
      let _id = generateUUID();
      isLastDeleted = false;
      captions.push({
        start: deleteStart,
        end: deleteEnd,
        active: false,
        silence: true,
        _id,
      });
    } else if (!el.active && !isLastDeleted) {
      isLastDeleted = true;
      deleteStart = el.start;
      deleteEnd = el.end;
    } else if (!el.active && isLastDeleted) {
      deleteEnd = el.end;
    }

    if (el.silence && el.active) {
      let _id = generateUUID();
      captions.push({
        start: el.start,
        end: el.end,
        silence: true,
        _id,
        active: true,
      });
    } else if (el.active) {
      let _id = generateUUID();
      let text = '';
      for (let i = 0; i < el.words.length; i++) {
        let word = el.words[i];
        text += word.text;
      }
      captions.push({
        start: el.start,
        end: el.end,
        text,
        silence: false,
        active: true,
        _id,
      });
    }
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
