import { fabric } from 'fabric';

export const generateSubtitles = (words, setSubArr) => {
  let arr = [];
  let sub = null;
  let firstDeletedIndex = null;

  const checkForPrevDeleted = (word, what, i) => {
    if (firstDeletedIndex) {
      arr[firstDeletedIndex].nextSub = arr.length - 1;
      // console.log(i);
      // console.log(
      //   arr[firstDeletedIndex],
      //   arr[firstDeletedIndex].nextSub,
      //   'setting nextSub Sub',
      //   word,
      //   arr.length - 1,
      //   what
      // );
      firstDeletedIndex = null;
    }
  };

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let nextWord = words[i + 1];
    if (word.deleted) {
      // console.log('deleted: ', word);
      if (sub) {
        arr.push({ ...sub });
        checkForPrevDeleted(word, 'deleted and is Sub', i);
        sub = null;
        arr.push({ ...word });
        firstDeletedIndex = arr.length - 1;
        // console.log('setting reference for nextSub', word, arr.length - 1);
      } else {
        arr.push({ ...word });
        if (!firstDeletedIndex) {
          firstDeletedIndex = arr.length - 1;
          // console.log('setting reference for nextSub', word, arr.length - 1);
        }
      }
      continue;
    }

    let isLast = i === words.length - 1;
    let wordTimeLength = +word.end - +word.start;
    let isLongSilence =
      !!word.silence &&
      ((!sub && nextWord && nextWord.deleted) || wordTimeLength >= 0.4);
    if (isLongSilence) {
      if (sub) {
        arr.push({ ...sub });
        checkForPrevDeleted(word, 'isSub and isLongSilence', i);
        sub = null;
        // console.log('isSub and isLongSilence', i, word.text);
      }
      // console.log(' isLongSilence', i, word.text);
      arr.push({ ...word });
      checkForPrevDeleted(word, 'isLongSilence', i);
      continue;
    } else if (word.silence) {
      if (sub) {
        sub.end += word.end;
        sub.words.push({
          ...word,
          text: '',
        });
        if (isLast) {
          arr.push(sub);
          checkForPrevDeleted(word, 'isSub and isLongSilence', i);
        }
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
          checkForPrevDeleted(word, 'silence', i);
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
      checkForPrevDeleted(word, 'isRoomForWord && containsMark && sub', i);
      sub = null;
      // console.log('isRoomForWord && containsMark && sub', i, word.text);
    } else if (containsMark && sub) {
      arr.push({ ...sub });
      checkForPrevDeleted(word, 'containsMark && sub', i);
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
      checkForPrevDeleted(word, 'containsMark && sub', i);
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (isRoomForWord) {
      let text = '';
      if (sub.strLength > 0) text = ' ';
      text += word.text;
      sub.words.push({ ...word, text });
      sub.end = word.end;
      sub.strLength += text.length;
      if (isLast) {
        arr.push(sub);
        checkForPrevDeleted(word, 'isRoomForWord', i);
      }
      // console.log('isRoomForWord', i, word.text);
    } else if (sub) {
      arr.push({ ...sub });
      checkForPrevDeleted(word, 'sub', i);
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
        checkForPrevDeleted(word, 'end', i);
      }
      // console.log('elsee', i, word.text);
    }
  }

  // console.log(arr);
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
