// export const findSubWithWordIndex2 = (wordIndex, words, subList) => {
//   let word = words[wordIndex];
//   if (subList && word) {
//     for (let i = 0; i < subList.length; i++) {
//       let sub = subList[i];
//       if (sub.words && +sub.end >= +word.start) {
//         for (let j = 0; j < sub.words.length; j++) {
//           let subWord = sub.words[j];
//           if (subWord && subWord._id === word._id) return i;
//         }
//       } else if (sub.silence && word._id === sub._id) return i;
//     }
//     return null;
//   } else return null;
// };

// Linked List Search
export const findSubWithWordIndex = (wordIndex, words, subList) => {
  let word = words[wordIndex];
  if (subList && word) {
    let subNode = subList.head;
    for (let i = 0; i < subList.length; i++) {
      let sub = subNode.val;
      if (sub.words && +sub.end >= +word.start) {
        for (let j = 0; j < sub.words.length; j++) {
          let subWord = sub.words[j];
          if (subWord && subWord._id === word._id) return subNode;
        }
      } else if (sub.silence && word._id === sub._id) return subNode;
      // console.log(sub);
      subNode = subNode.next;
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
