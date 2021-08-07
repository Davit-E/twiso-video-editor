export const findSubIndexWithWordIndex = (wordIndex, words, subArr) => {
  if (subArr) {
    let word = words[wordIndex];
    for (let i = 0; i < subArr.length; i++) {
      let sub = subArr[i];
      if (sub.words) {
        for (let j = 0; j < sub.words.length; j++) {
          let subWord = sub.words[j];
          if (subWord._id === word._id) return i;
        }
      } else if (sub.silence && word._id === sub._id) return i;
    }
    return null;
  } else return null;
};

export const findWordIndexWithId = (id, words) => {
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word._id === id) return i;
  }
  return null;
};
