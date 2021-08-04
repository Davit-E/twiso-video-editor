export const findSubIndexWithWordIndex = (wordIndex, words, subArr) => {
  if (subArr) {
    let word = words[wordIndex];
    console.log(word);
    for (let i = 0; i < subArr.length; i++) {
      let sub = subArr[i];
      if (sub.words) {
        for (let j = 0; j < sub.words.length; j++) {
          let subWord = sub.words[j];
          if (subWord.id === word.id) return i;
        }
      } else if (sub.silence && word.id === sub.id) return i;
    }
    return null;
  } else return null;
};

export const findWordIndexWithId = (id, words) => {
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.id === id) return i;
  }
  return null;
};
