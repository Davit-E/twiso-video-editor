import { fabric } from 'fabric';

export const generateSubtitles = (words, setSubArr) => {
  let arr = [];
  let sub = null;
  let firstDeletedIndex = null;
  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    if (word.deleted) {
      if (sub) {
        arr.push({ ...sub });
        sub = null;
        arr.push({ ...word });
        firstDeletedIndex = arr.length - 1;
      } else arr.push({ ...word });
      continue;
    }

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
          strLength: 0,
        };
        if (isLast) {
          arr.push({ ...word });
        }
        // console.log('silence', i, word.text);
      }
      continue;
    }

    let containsMark = !!word.text.match(/[.,:!?]$/);

    let isRoomForWord =
      sub !== null && sub.strLength + word.text.length + 1 < 48;
    // if (sub) console.log(sub.words, sub.strLength, word.text, isRoomForWord);

    if (isRoomForWord && containsMark && sub) {
      let text = '';
      if (sub.strLength > 0) text = ' ';
      text += word.text;
      sub.words.push({ ...word, text });
      sub.end = word.end;
      sub.strLength += text.length;
      arr.push({ ...sub });
      sub = null;
      // console.log('isRoomForWord && containsMark && sub', i, word.text);
    } else if (containsMark && sub) {
      arr.push({ ...sub });
      sub = { words: [] };
      sub.words.push({ ...word });
      sub.start = word.start;
      sub.end = word.end;
      sub.strLength = word.text.length;
      arr.push({ ...sub });
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (containsMark) {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
      };
      arr.push({ ...sub });
      if (firstDeletedIndex) {
        arr[firstDeletedIndex].nextSub = arr.length - 1;
        firstDeletedIndex = null;
      }
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (isRoomForWord) {
      let text = '';
      if (sub.strLength > 0) text = ' ';
      text += word.text;
      sub.words.push({ ...word, text });
      sub.end = word.end;
      sub.strLength += text.length;
      if (isLast) arr.push(sub);
      // console.log('isRoomForWord', i, word.text);
    } else if (sub) {
      arr.push({ ...sub });
      if (firstDeletedIndex) {
        arr[firstDeletedIndex].nextSub = arr.length - 1;
        firstDeletedIndex = null;
      }
      sub = { words: [] };
      sub.words.push({ ...word });
      sub.start = word.start;
      sub.end = word.end;
      sub.strLength = word.text.length;
      if (isLast) arr.push(sub);
      // console.log('sub', i, word.text);
    } else {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
      };
      if (isLast) {
        arr.push(sub);
        if (firstDeletedIndex) {
          arr[firstDeletedIndex].nextSub = arr.length - 1;
          firstDeletedIndex = null;
        }
      } else if (firstDeletedIndex) {
        arr[firstDeletedIndex].nextSub = arr.length;
        firstDeletedIndex = null;
      }

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
  let x = canvas.getWidth() / (canvas.getZoom() * 2);
  let y =
    canvas.getHeight() / canvas.getZoom() - subtitle.height - subtitle.paddingY;
  subtitle.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
  return subtitle;
};

export const displaySub = (sub, subIndex, arr) => {
  // console.log(sub);
  if (arr[subIndex].silence) sub.visible = false;
  else if (!arr[subIndex].deleted) {
    let text = '';
    for (let i = 0; i < arr[subIndex].words.length; i++) {
      let word = arr[subIndex].words[i];
      text += word.text;
    }
    // console.log(text);
    sub.set({ text, visible: true });
  }
};
