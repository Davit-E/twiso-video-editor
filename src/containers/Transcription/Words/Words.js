import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './Words.module.css';
import restoreText from '../../../assets/editor/restoreText.svg';
import EditorContext from '../../../contexts/EditorContext';

const Words = ({
  wordsArr,
  currentWordIndex,
  searchInput,
  wordClickHandler,
  inputIndex,
  setInputIndex,
  currentSelection,
  fabricSub,
  currentSub,
  setShouldRerenderSub,
}) => {
  const { editorDispatch } = useContext(EditorContext);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleNotSilenceAndText = (id, text) => {
    let words = currentSub.val.words;
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word._id === id) {
        let isWhitespace = word.text.indexOf(' ') === 0;
        word.text = isWhitespace ? ' ' + text : text;
        if (word.silence) word.silence = false;
        break;
      }
    }
  };

  const handleSilenceAndText = (id, text) => {
    let words = currentSub.val.words;
    if (words) {
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (word._id === id) {
          let isFirst = i === 0;
          text = isFirst ? text + ' ' : text;
          let isNoWhitespace = word.text.indexOf(' ') !== 0;
          word.text = isNoWhitespace && !isFirst ? ' ' + text : text;
          if (word.silence) word.silence = false;
          break;
        }
      }
    } else {
      currentSub.val.silence = false;
      currentSub.val.words = [{ ...currentSub.val, text }];
    }
  };

  const handleNoText = (id) => {
    let words = currentSub.val.words;
    let silenceCount = 0;
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word._id === id) {
        word.text = '';
        word.silence = true;
      }
      if (word.silence) silenceCount++;
    }
    if (silenceCount === words.length) {
      currentSub.val.silence = true;
      currentSub.val.words = null;
    }
  };

  const handleSubTextChange = (id, text, isSilence) => {
    if (!isSilence && text && id) {
      handleNotSilenceAndText(id, text);
    } else if (text && isSilence) {
      handleSilenceAndText(id, text);
    } else if (id) {
      handleNoText(id);
    }
    setShouldRerenderSub(true);
  };

  const blurHandler = (e) => {
    let id = e.target.parentNode.id;
    let inputVal = input.trim().length > 0 ? input : null;
    if (wordsArr[inputIndex]) {
      if (inputVal && !wordsArr[inputIndex].silence) {
        wordsArr[inputIndex].text = inputVal;
        if (fabricSub) handleSubTextChange(id, inputVal, false);
      } else if (inputVal) {
        wordsArr[inputIndex].text = inputVal;
        wordsArr[inputIndex].silence = false;
        if (fabricSub) handleSubTextChange(id, inputVal, true);
      } else {
        if (fabricSub && !wordsArr[inputIndex].silence)
          handleSubTextChange(id, inputVal, false);
        wordsArr[inputIndex].silence = true;
      }
    }
    setInput('');
    setInputIndex(null);
    editorDispatch({ type: 'setShouldTriggerWordsUpdate', data: true });
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
    if (isLastDeleted && !word.active) shouldShow = false;
    else shouldShow = true;
    let isCurrent = i === currentWordIndex && !currentSelection && word.active;
    let isHighlight =
      !word.silence &&
      word.active &&
      searchInput.trim().length > 1 &&
      word.text.trim().toLowerCase().includes(searchInput.trim().toLowerCase());

    if (!isLastDeleted && !word.active) isLastDeleted = true;
    if (isLastDeleted && word.active) isLastDeleted = false;

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

    let content = !word.active ? (
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
        id={word._id}
        key={word._id}
        className={[
          styles.WordContainer,
          isCurrent ? styles.CurrentWord : null,
          isHighlight ? styles.Highlight : null,
          isSelectionMode ? styles.InSelection : null,
        ].join(' ')}
        onClick={(e) => wordClickHandler(e, !word.active)}
      >
        {content}
      </span>
    ) : null;
  });
};

export default Words;
