import { LinkedList } from './linkedList';

export const generateSubtitles = (words, setSubs) => {
  let list = new LinkedList();
  let sub = null;
  let firstDeletedIndex = null;

  const checkForPrevDeleted = (word, which, i) => {
    if (firstDeletedIndex) {
      list.get(firstDeletedIndex).nextSub = list.tail;
      // console.log(i);
      // console.log(
      //   list[firstDeletedIndex],
      //   list[firstDeletedIndex].nextSub,
      //   'setting nextSub Sub',
      //   word,
      //   list.length - 1,
      //   which
      // );
      firstDeletedIndex = null;
    }
  };

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    let nextWord = words[i + 1];
    if (!word.active) {
      if (sub) {
        list.push({ ...sub });
        checkForPrevDeleted(word, 'not active and is Sub', i);
        sub = null;
        list.push({ ...word });
        firstDeletedIndex = list.length - 1;
        // console.log('setting reference for nextSub', word, list.length - 1);
      } else {
        list.push({ ...word });
        if (!firstDeletedIndex) {
          firstDeletedIndex = list.length - 1;
          // console.log('setting reference for nextSub', word, list.length - 1);
        }
      }
      continue;
    }

    let isLast = i === words.length - 1;
    let wordTimeLength = +word.end - +word.start;
    let isLongSilence =
      !!word.silence &&
      ((!sub && nextWord && !nextWord.active) || wordTimeLength >= 0.4);
    if (isLongSilence) {
      if (sub) {
        list.push({ ...sub });
        checkForPrevDeleted(word, 'isSub and isLongSilence', i);
        sub = null;
        // console.log('isSub and isLongSilence', i, word.text);
      }
      // console.log(' isLongSilence', i, word.text);
      list.push({ ...word });
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
          list.push(sub);
          checkForPrevDeleted(word, 'isSub and isLongSilence', i);
        }
        // console.log('isSub and silence', i, word.text);
      } else {
        sub = {
          words: [{ ...word, text: '' }],
          start: word.start,
          end: word.end,
          strLength: 0,
          active: true,
        };
        if (isLast) {
          list.push({ ...word });
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
      list.push({ ...sub });
      checkForPrevDeleted(word, 'isRoomForWord && containsMark && sub', i);
      sub = null;
      // console.log('isRoomForWord && containsMark && sub', i, word.text);
    } else if (containsMark && sub) {
      list.push({ ...sub });
      checkForPrevDeleted(word, 'containsMark && sub', i);
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
        active: true,
      };
      list.push({ ...sub });
      sub = null;
      // console.log('containsMark && sub', i, word.text);
    } else if (containsMark) {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
        active: true,
      };
      list.push({ ...sub });
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
        list.push(sub);
        checkForPrevDeleted(word, 'isRoomForWord', i);
      }
      // console.log('isRoomForWord', i, word.text);
    } else if (sub) {
      list.push({ ...sub });
      checkForPrevDeleted(word, 'sub', i);
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
        active: true,
      };
      if (isLast) list.push(sub);
      // console.log('sub', i, word.text);
    } else {
      sub = {
        words: [{ ...word }],
        start: word.start,
        end: word.end,
        strLength: word.text.length,
        active: true,
      };
      if (isLast) {
        list.push(sub);
        checkForPrevDeleted(word, 'end', i);
      }
      // console.log('elsee', i, word.text);
    }
  }
  // console.log(list);
  setSubs(list);
};
