import { findSubIndexWithWordIndex } from '../../utils/findIndex';

const handleDelete = (wordsArr, setCuts, setPlayerTime, wordIndex) => {
  let arr = [];
  let isLastDeleted = false;
  let cutStart = 0;
  let cutStartIndex = 0;
  let cutEndIndex = 0;
  let cutEnd = 0;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (!word.deleted && isLastDeleted) {
      isLastDeleted = false;
      wordsArr[cutStartIndex].next = i;
      arr.push({ start: cutStart, end: cutEnd });
    } else if (word.deleted && !isLastDeleted) {
      isLastDeleted = true;
      cutStart = word.start;
      cutStartIndex = i;
      cutEnd = word.end;
    } else if (word.deleted && isLastDeleted) {
      cutEnd = word.end;
      cutEndIndex = i;
    }
  }

  if (isLastDeleted) arr.push({ start: cutStart, end: cutEnd });

  if (isLastDeleted && cutStartIndex !== wordsArr.length - 1) {
    wordsArr[cutStartIndex].next = cutEndIndex;
  } else if (isLastDeleted) {
    wordsArr[cutStartIndex].next = wordsArr.length - 1;
  }
  setPlayerTime(wordIndex);
  console.log(wordsArr);
  setCuts([...arr]);
};

const handleRestore = (setCuts, setPlayerTime, wordIndex, restoreStart) => {
  setCuts((prevState) => {
    let newState = [];
    for (let i = 0; i < prevState.length; i++) {
      let cut = prevState[i];
      if (cut.start !== restoreStart) newState.push(cut);
    }
    setPlayerTime(wordIndex);
    return [...newState];
  });
};

const handleVideoCuts = (
  type,
  wordsArr,
  setCuts,
  setPlayerTime,
  wordIndex,
  restoreStart
) => {
  if (type === 'delete') {
    handleDelete(wordsArr, setCuts, setPlayerTime, wordIndex);
  } else if (type === 'restore')
    handleRestore(setCuts, setPlayerTime, wordIndex, restoreStart);
};

const findAndSetCurrentWord = (
  deletedIndex,
  wordsArr,
  setWordIndex,
  setCuts,
  setPlayerTime,
  setCurrentSubIndex,
  subArr
) => {
  let currentIndex = null;
  for (let i = deletedIndex; i >= 0; i--) {
    let word = wordsArr[i];
    if (!word.deleted) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex === null) {
    for (let i = deletedIndex; i < wordsArr.length; i++) {
      let word = wordsArr[i];
      if (!word.deleted) {
        currentIndex = i;
        break;
      }
    }
  }

  setWordIndex(currentIndex);
  // let subIndex = findSubIndexWithWordIndex(currentIndex, wordsArr, subArr);
  // setCurrentSubIndex(subIndex);
  handleVideoCuts(
    'delete',
    wordsArr,
    setCuts,
    setPlayerTime,
    currentIndex,
    subArr
  );
};

export const deleteWord = (
  wordsArr,
  wordIndex,
  setWordIndex,
  setCuts,
  setPlayerTime,
  setCurrentSubIndex,
  subArr
) => {
  let word = wordsArr[wordIndex];
  word.deleted = true;
  // handleSubDelete(wordsArr, wordIndex, subArr);

  findAndSetCurrentWord(
    wordIndex,
    wordsArr,
    setWordIndex,
    setCuts,
    setPlayerTime,
    setCurrentSubIndex,
    subArr
  );
};

export const deleteSelection = (
  wordsArr,
  setWordIndex,
  currentSelection,
  setCurrentSelection,
  setCuts,
  setPlayerTime,
  setCurrentSubIndex,
  subArr
) => {
  let deletedStartIndex = currentSelection.start;
  let deleteEndIndex = currentSelection.end;

  for (let i = deletedStartIndex; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    word.deleted = true;
    if (i === deleteEndIndex) break;
  }

  findAndSetCurrentWord(
    deletedStartIndex,
    wordsArr,
    setWordIndex,
    setCuts,
    setPlayerTime,
    setCurrentSubIndex,
    subArr
  );
  setCurrentSelection(null);
};

export const restoreDeleted = (
  wordsArr,
  wordIndex,
  setWordIndex,
  setCurrentSelection,
  setCuts,
  setPlayerTime,
  subArr,
  setCurrentSubIndex
) => {
  for (let i = wordIndex; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.deleted) {
      word.deleted = false;
      if (word.next !== null) word.next = null;
    } else break;
  }
  let restoreStart = wordsArr[wordIndex].start;
  // let subIndex = findSubIndexWithWordIndex(wordIndex, wordsArr, subArr);
  // setCurrentSubIndex(subIndex);

  handleVideoCuts(
    'restore',
    null,
    setCuts,
    setPlayerTime,
    wordIndex,
    restoreStart
  );
  setCurrentSelection(null);
  setWordIndex(wordIndex);
};
