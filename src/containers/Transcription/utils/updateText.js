const findAndSetCurrentWord = (deletedIndex, wordsArr, setWordId, setPlayerTime) => {
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
  setPlayerTime(word ? word.id : null)
  setWordId(word ? word.id : null);
}

export const deleteWord = (wordsArr, wordId, setWordId, setCuts, setPlayerTime) => {
  let deletedIndex = null;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === wordId) {
      word.deleted = true;
      deletedIndex = i;
      break;
    }
  }
  findAndSetCurrentWord(deletedIndex, wordsArr, setWordId, setPlayerTime) 
};

export const deleteSelection = (
  wordsArr,
  setWordId,
  currentSelection,
  setCurrentSelection,
  setCuts,
  setPlayerTime
) => {
  let isDeleteMode = false
  let deletedIndex = null;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === currentSelection.start) {
      isDeleteMode = true
      deletedIndex = i;
    }else if (word.id === currentSelection.end ) {
      isDeleteMode = false;
      word.deleted = true
      break;
    }
    if(isDeleteMode){
      word.deleted = true
    }
  }
  findAndSetCurrentWord(deletedIndex, wordsArr, setWordId, setPlayerTime) 
  setCurrentSelection(null)
};

export const restoreDeleted = (
  wordsArr,
  wordId,
  setWordId,
  setCurrentSelection,
  setCuts,
  setPlayerTime
) => {
  let currentIndex = 0;
  for (let i = 0; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.id === wordId) {
      currentIndex = i;
      break;
    }
  }
  for (let i = currentIndex; i < wordsArr.length; i++) {
    let word = wordsArr[i];
    if (word.deleted) {
      word.deleted = false;
    } else break;
  }
  setCurrentSelection(null);
  setWordId(wordId);
  setPlayerTime(wordId)
};
