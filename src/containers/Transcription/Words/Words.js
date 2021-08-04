import React, { useState, useEffect, useRef } from 'react';
import styles from './Words.module.css';
import restoreText from '../../../assets/restoreText.svg';
const Words = ({
  wordsArr,
  currentWordIndex,
  searchInput,
  wordClickHandler,
  inputIndex,
  setInputIndex,
  currentSelection,
  currentSub,
  currentSubIndex,
  subArr,
  setShouldRerenderSub
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubTextChange = (id, text, isSilence) => {
    if (!isSilence && text && id) {
      let words = subArr[currentSubIndex].words;
      console.log(subArr[currentSubIndex]);
      console.log(words);
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (word.id === id) {
          let isWhitespace = word.text.indexOf(' ') === 0;
          word.text = isWhitespace ? ' ' + text : text;
          if (word.silence) word.silence = false;
          break;
        }
      }
    } else if (text && isSilence) {
      subArr[currentSubIndex].silence = false;
      subArr[currentSubIndex].words = [{ ...subArr[currentSubIndex], text }];
    } else if (id) {
      let words = subArr[currentSubIndex].words;
      console.log(words);
      let silenceCount = 0;
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (word.id === id) {
          word.text = '';
          word.silence = true;
        }
        if (word.silence) silenceCount++;
      }
      if (silenceCount === words.length) {
        subArr[currentSubIndex].silence = true;
        subArr[currentSubIndex].words = null;
      }
    }
    setShouldRerenderSub(true);
  };

  const blurHandler = (e) => {
    let id = e.target.parentNode.id;
    let inputVal = input.trim().length > 0 ? input : null;
    if (wordsArr[inputIndex]) {
      if (inputVal && !wordsArr[inputIndex].silence) {
        wordsArr[inputIndex].text = inputVal;
        if (currentSub) handleSubTextChange(id, inputVal, false);
      } else if (inputVal) {
        wordsArr[inputIndex].text = inputVal;
        wordsArr[inputIndex].silence = false;
        if (currentSub) handleSubTextChange(id, inputVal, true);
      } else {
        if (currentSub && !wordsArr[inputIndex].silence)
          handleSubTextChange(id, inputVal, false);
        wordsArr[inputIndex].silence = true;
      }
    }
    setInput('');
    setInputIndex(null);
  };

  let isLastDeleted = false;
  let shouldShow = true;
  let isSelectionMode = false;
  let isSelectionEnd = false;

  useEffect(() => {
    if (inputIndex !== null) {
      inputRef.current.focus();
      if (wordsArr[inputIndex] && !wordsArr[inputIndex].silence) {
        setInput(wordsArr[inputIndex].text);
      }
    }
  }, [inputIndex, wordsArr]);

  return wordsArr.map((word, i) => {
    if (isLastDeleted && word.deleted) shouldShow = false;
    else shouldShow = true;
    let isCurrent =
      i === currentWordIndex && !currentSelection && !word.deleted;
    let isHighlight =
      !word.silence &&
      !word.deleted &&
      searchInput.trim().length > 1 &&
      word.text.trim().toLowerCase().includes(searchInput.trim().toLowerCase());

    if (!isLastDeleted && word.deleted) isLastDeleted = true;
    if (isLastDeleted && !word.deleted) isLastDeleted = false;

    if (currentSelection && currentSelection.start === i) {
      isSelectionMode = true;
    } else if (currentSelection && currentSelection.end === i) {
      isSelectionEnd = true;
    } else if (isSelectionEnd) {
      isSelectionMode = false;
      isSelectionEnd = false;
    }

    let isInput = inputIndex !== null && isCurrent;
    let innerContent = isInput ? (
      <input
        ref={inputRef}
        className={styles.WordInput}
        type='text'
        value={input}
        onBlur={blurHandler}
        onChange={(e) => setInput(e.target.value)}
      />
    ) : (
      <span className={!word.silence ? styles.Word : styles.Pause}>
        {!word.silence ? word.text + ' ' : '•••• '}
      </span>
    );

    let content = word.deleted ? (
      <span className={styles.Deleted}>
        <span className={styles.DeletedImgContainer}>
          <img
            className={styles.DeletedImg}
            src={restoreText}
            alt='restore text'
          />
        </span>
        <span className={styles.DeletedText}>[...] </span>
      </span>
    ) : (
      innerContent
    );

    let containerStyle = { width: 'auto' };
    if (isInput) {
      containerStyle.width = !word.silence
        ? word.text.length * 1.5 + 'ch'
        : '70px';
      containerStyle.marginRight = '0.4rem';
    }

    return shouldShow ? (
      <span
        style={containerStyle}
        id={word.id}
        key={word.id}
        className={[
          styles.WordContainer,
          isCurrent ? styles.CurrentWord : null,
          isHighlight ? styles.Highlight : null,
          isSelectionMode ? styles.InSelection : null,
        ].join(' ')}
        onClick={(e) => wordClickHandler(e, word.deleted)}
      >
        {content}
      </span>
    ) : null;
  });
};

export default Words;
