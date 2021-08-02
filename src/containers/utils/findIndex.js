export const findSubIndexWithWordIndex = (wordIndex, words, subArr) => {
  if (subArr) {
    let word = words[wordIndex];
    for (let i = 0; i < subArr.length; i++) {
      let sub = subArr[i];
      if (+sub.start <= +word.start && +sub.end >= +word.end) {
        return i;
      }
    }
    return null
  } else return null;
};

export const findWordIndexWithId = (id, words) => {
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.id === id) return i;
  }
  return null;
};
