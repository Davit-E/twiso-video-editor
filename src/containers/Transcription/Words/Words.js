import React, { useState, useEffect, useRef } from 'react';
import styles from './Words.module.css';
import restoreText from '../../../assets/restoreText.svg';

const Words = ({
  wordsArr,
  currentWordId,
  searchInput,
  wordClickHandler,
  inputId,
  setInputId,
  currentSelection,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const blurHandler = () => {
    let inputVal = input.trim().length > 0 ? input : null;
    let currentIndex = null;
    for (let i = 0; i < wordsArr.length; i++) {
      let word = wordsArr[i];
      if (word.id === inputId) {
        currentIndex = i;
        break;
      }
    }

    if (wordsArr[currentIndex]) {
      if (inputVal && !wordsArr[currentIndex].silence) {
        wordsArr[currentIndex].text = inputVal;
      } else if (inputVal) {
        wordsArr[currentIndex].text = inputVal;
        wordsArr[currentIndex].silence = false;
      } else wordsArr[currentIndex].silence = true;
    }
    setInput('');
    setInputId(null);
  };

  let isLastDeleted = false;
  let shouldShow = true;
  let isSelectionMode = false;
  let isSelectionEnd = false;

  useEffect(() => {
    if (inputId) {
      inputRef.current.focus();
      let currentIndex = null;
      for (let i = 0; i < wordsArr.length; i++) {
        let word = wordsArr[i];
        if (word.id === inputId) {
          currentIndex = i;
          break;
        }
      }
      if (wordsArr[currentIndex] && !wordsArr[currentIndex].silence) {
        setInput(wordsArr[currentIndex].text);
      }
    }
  }, [inputId, wordsArr]);

  return wordsArr.map((word) => {
    if (isLastDeleted && word.deleted) shouldShow = false;
    else shouldShow = true;
    let isCurrent =
      word.id === currentWordId && !currentSelection && !word.deleted;
    let isHighlight =
      !word.silence &&
      !word.deleted &&
      searchInput.trim().length > 1 &&
      word.text.trim().toLowerCase().includes(searchInput.trim().toLowerCase());

    if (!isLastDeleted && word.deleted) isLastDeleted = true;
    if (isLastDeleted && !word.deleted) isLastDeleted = false;

    if (currentSelection && currentSelection.start === word.id) {
      isSelectionMode = true;
    } else if (currentSelection && currentSelection.end === word.id) {
      isSelectionEnd = true;
    } else if (isSelectionEnd) {
      isSelectionMode = false;
      isSelectionEnd = false;
    }

    let isInput = inputId && isCurrent;
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
