const handleDelete = (wordsArr, setCuts, setPlayerTime, wordId) => {
  let arr = [];
  let isLastDeleted = false;
  let cutStart = 0;
  let cutEnd = 0;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (!word.deleted && isLastDeleted) {
      isLastDeleted = false;
      arr.push({ start: cutStart, end: cutEnd });
    } else if (word.deleted && !isLastDeleted) {
      isLastDeleted = true;
      cutStart = word.start;
      cutEnd = word.end;
    } else if (word.deleted && isLastDeleted) {
      cutEnd = word.end;
    }
  }
  if (isLastDeleted) arr.push({ start: cutStart, end: cutEnd });
  setPlayerTime(wordId, arr);
  setCuts([...arr]);
};

const handleRestore = (setCuts, setPlayerTime, wordId, restoreStart) => {
  setCuts((prevState) => {
    let newState = [];
    for (let i = 0; i < prevState.length; i++) {
      let cut = prevState[i];
      if (cut.start !== restoreStart) newState.push(cut);
    }
    setPlayerTime(wordId, newState);
    return [...newState];
  });
};

const handleVideoCuts = (
  type,
  wordsArr,
  setCuts,
  setPlayerTime,
  wordId,
  restoreStart
) => {
  if (type === 'delete') handleDelete(wordsArr, setCuts, setPlayerTime, wordId);
  else if (type === 'restore')
    handleRestore(setCuts, setPlayerTime, wordId, restoreStart);
};

const findAndSetCurrentWord = (
  deletedIndex,
  wordsArr,
  setWordId,
  setCuts,
  setPlayerTime
) => {
  let currentIndex = null;
  if (deletedIndex !== null && deletedIndex !== 0) {
    for (let i = deletedIndex; i >= 0; i--) {
      let word = wordsArr[i];
      if (!word.deleted) {
        currentIndex = i;
        break;
      }
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
  let word = wordsArr[currentIndex];
  setWordId(word ? word.id : null);
  handleVideoCuts('delete', wordsArr, setCuts, setPlayerTime, word.id);
};

export const deleteWord = (
  wordsArr,
  wordId,
  setWordId,
  setCuts,
  setPlayerTime
) => {
  let deletedIndex = null;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === wordId) {
      word.deleted = true;
      deletedIndex = i;
      break;
    }
  }
  findAndSetCurrentWord(
    deletedIndex,
    wordsArr,
    setWordId,
    setCuts,
    setPlayerTime
  );
};

export const deleteSelection = (
  wordsArr,
  setWordId,
  currentSelection,
  setCurrentSelection,
  setCuts,
  setPlayerTime
) => {
  let isDeleteMode = false;
  let deletedStartIndex = null;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === currentSelection.start) {
      isDeleteMode = true;
      deletedStartIndex = i;
    } else if (word.id === currentSelection.end) {
      isDeleteMode = false;
      word.deleted = true;
      break;
    }
    if (isDeleteMode) {
      word.deleted = true;
    }
  }

  findAndSetCurrentWord(
    deletedStartIndex,
    wordsArr,
    setWordId,
    setCuts,
    setPlayerTime
  );
  setCurrentSelection(null);
};

export const restoreDeleted = (
  wordsArr,
  wordId,
  setWordId,
  setCurrentSelection,
  setCuts,
  setPlayerTime
) => {
  let startIndex = 0;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === wordId) {
      startIndex = i;
      break;
    }
  }
  for (let i = startIndex; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.deleted) word.deleted = false;
    else {
      break;
    }
  }

  let restoreStart = wordsArr[startIndex].start;
  handleVideoCuts(
    'restore',
    null,
    setCuts,
    setPlayerTime,
    wordId,
    restoreStart
  );
  setCurrentSelection(null);
  setWordId(wordId);
};
