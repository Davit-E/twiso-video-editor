import { fabric } from 'fabric';

export const generateSubtitles = (words, setSubArr) => {
  let arr = [];
  let sub = null;
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let isLast = i === words.length - 1;
    let wordTimeLength = +word.end - +word.start;
    let isLongSilence = !!word.silence && wordTimeLength >= 0.4;
    if (isLongSilence) {
      if (sub) {
        arr.push({ ...sub });
        sub = null;
        // console.log('isSub and isLongSilence', i, word.text);
      }
      // console.log(' isLongSilence', i, word.text);
      arr.push({ ...word });
      continue;
    } else if (word.silence) {
      if (sub) {
        sub.end += word.end;
        sub.words.push({
          ...word,
          text: '',
        });
        if (isLast) arr.push(sub);
        // console.log('isSub and silence', i, word.text);
      } else {
        sub = {
          words: [{ ...word, text: '' }],
          start: word.start,
          end: word.end,
          charLength: 0,
        };
        if (isLast) {
          arr.push({ ...word });
        }
        // console.log('silence', i, word.text);
      }
      continue;
    }

    let containsMark = !word.silence && !!word.text.match(/[.,:!?]$/);

    let isRoomForWord =
      sub !== null &&
      !word.silence &&
      sub.charLength + word.text.length + 1 < 48;
    // if (sub) console.log(sub.words, sub.charLength, word.text, isRoomForWord);

    if (isRoomForWord && containsMark && sub) {
      let text = '';
      if (sub.charLength > 0) text = ' ';
      text += word.text;
      sub.words.push({ ...word, text });
      sub.end = word.end;
      sub.charLength += text.length;
      arr.push({ ...sub });
      sub = null;
      // console.log('isRoomForWord && containsMark && sub', i, word.text);
    } else if (containsMark && sub) {
      arr.push({ ...sub });
      sub = { words: [] };
      sub.words.push({ ...word });
      sub.start = word.start;
      sub.end = word.end;
      sub.charLength = word.text.length;
      arr.push({ ...sub });
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (containsMark) {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        charLength: word.text.length,
      };
      arr.push({ ...sub });
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (isRoomForWord) {
      let text = '';
      if (sub.charLength > 0) text = ' ';
      text += word.text;
      sub.words.push({ ...word, text });
      sub.end = word.end;
      sub.charLength += text.length;
      if (isLast) arr.push(sub);
      // console.log('isRoomForWord', i, word.text);
    } else if (sub) {
      arr.push({ ...sub });
      sub = { words: [] };
      sub.words.push({ ...word });
      sub.start = word.start;
      sub.end = word.end;
      sub.charLength = word.text.length;
      if (isLast) arr.push(sub);
      // console.log('sub', i, word.text);
    } else {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        charLength: word.text.length,
      };
      if (isLast) arr.push(sub);
      // console.log('elsee', i, word.text);
    }
    // console.log(i);
  }

  console.log(arr);
  setSubArr(arr);
};

export const newSubtitle = (canvas, state) => {
  let subtitle = new fabric.Subtitle(' ', {
    paddingX: 20,
    paddingY: 20,
    // bgCornerRadius: 5,
    originX: 'center',
    originY: 'center',
    editable: false,
    textAlign: 'center',
    ...state.subtitlesState,
    id: 'subtitle',
    excludeFromExport: true,
    prevTop: null,
    prevLeft: null,
    visible: false,
  });
  let x =
    canvas.getHeight() / canvas.getZoom() - subtitle.height - subtitle.paddingY;
  let y = canvas.getWidth() / canvas.getZoom();
  subtitle.setPositionByOrigin(new fabric.Point(y / 2, x), 'center', 'center');
  return subtitle;
};

export const displaySub = (sub, subIndex, arr) => {
  // console.log(sub);
  if (arr[subIndex].silence) sub.visible = false;
  else {
    let notDeleted = arr[subIndex].words.filter((el) => !el.deleted);
    // console.log(notDeleted);
    let text = '';
    for (let i = 0; i < notDeleted.length; i++) {
      let el = notDeleted[i];
      text += el.text;
    }
    // console.log(text);
    sub.set({ text, visible: true });
  }
};
