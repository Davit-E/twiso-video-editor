import React, { useState, useEffect, useCallback } from 'react';
import styles from './Transcription.module.css';
import cut from '../../assets/cut.svg';
import search from '../../assets/search.svg';
import {
  deleteWord,
  restoreDeleted,
  deleteSelection,
} from './utils/updateTextAndCuts';
import Words from './Words/Words';

const Transcription = ({
  words,
  currentWordIndex,
  setCurrentWordIndex,
  isPlaying,
  videoRef,
  setCuts,
  currentSelection,
  setCurrentSelection,
  setPlayerTime,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [inputIndex, setInputIndex] = useState(null);
  const findWordIndexWithId = useCallback(
    (id) => {
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (word.id === id) return i;
      }
      return null;
    },
    [words]
  );

  const wordClickHandler = (e, isDeleted) => {
    let id = e.currentTarget.id;
    let index = findWordIndexWithId(id);
    if (isPlaying) videoRef.current.pause();
    if (e.detail > 1 && inputIndex === null) setInputIndex(index);
    if (!isDeleted && inputIndex === null && index !== null) {
      setCurrentSelection(null);
      setPlayerTime(index);
      setCurrentWordIndex(index);
    } else if (inputIndex === null) {
      restoreDeleted(
        words,
        index,
        setCurrentWordIndex,
        setCurrentSelection,
        setCuts,
        setPlayerTime
      );
    }
  };

  const handleSelection = useCallback(
    (selection, anchorNode, focusNode, isAnchorNode, isFocusNode, position) => {
      let start = '';
      let end = '';
      if (anchorNode.parentNode.id === focusNode.parentNode.id) {
        let index = findWordIndexWithId(anchorNode.parentNode.id);
        if (anchorNode.parentNode.id && index !== null) {
          setPlayerTime(index);
          setCurrentWordIndex(index);
        }
        setCurrentSelection(null);
      } else if (isAnchorNode && isFocusNode) {
        if (position === 4) {
          start = anchorNode.parentNode.id;
          end = focusNode.parentNode.id;
        } else if (position === 2) {
          start = focusNode.parentNode.id;
          end = anchorNode.parentNode.id;
        }
      } else if (isAnchorNode) {
        if (position === 4) {
          start = anchorNode.parentNode.id;
          end = anchorNode.parentNode.parentNode.lastChild.id;
        } else if (position === 2) {
          start = anchorNode.parentNode.parentNode.firstChild.id;
          end = anchorNode.parentNode.id;
        }
      } else if (isFocusNode) {
        if (position === 4) {
          start = anchorNode.parentNode.parentNode.firstChild.parentNode.id;
          end = focusNode.id;
        } else if (position === 2) {
          start = focusNode.id;
          end = anchorNode.parentNode.parentNode.lastChild.parentNode.id;
        }
      }

      if (start !== '' && end !== '') {
        let indexStart = findWordIndexWithId(start);
        let indexEnd = findWordIndexWithId(end);
        if (indexStart !== null && indexEnd !== null) {
          setCurrentSelection({ start: indexStart, end: indexEnd });
          setPlayerTime(indexStart);
          setCurrentWordIndex(indexStart);
        }
      }
      selection.removeAllRanges();
    },
    [
      setCurrentWordIndex,
      setCurrentSelection,
      setPlayerTime,
      findWordIndexWithId,
    ]
  );

  const mouseUpHandler = useCallback(
    (e) => {
      let selection = document.getSelection();
      if (e.detail < 2 && selection.anchorNode && selection.focusNode) {
        let anchorNode = selection.anchorNode.parentNode;
        let focusNode = selection.focusNode.parentNode;
        let isAnchorNode = anchorNode.tagName === 'SPAN';
        let isFocusNode = focusNode.tagName === 'SPAN';
        let position = selection.anchorNode.compareDocumentPosition(
          selection.focusNode
        );
        if ((isAnchorNode || isFocusNode) && !selection.isCollapsed) {
          if (isPlaying) videoRef.current.pause();
          handleSelection(
            selection,
            anchorNode,
            focusNode,
            isAnchorNode,
            isFocusNode,
            position
          );
        }
      }
    },
    [handleSelection, isPlaying, videoRef]
  );

  useEffect(() => {
    document.addEventListener('mouseup', mouseUpHandler);
    return () => document.removeEventListener('mouseup', mouseUpHandler);
  }, [mouseUpHandler]);

  const cutClickHandler = () => {
    if (isPlaying) videoRef.current.pause();
    if (!currentSelection && currentWordIndex !== null) {
      deleteWord(
        words,
        currentWordIndex,
        setCurrentWordIndex,
        setCuts,
        setPlayerTime
      );
    } else if (currentSelection) {
      deleteSelection(
        words,
        setCurrentWordIndex,
        currentSelection,
        setCurrentSelection,
        setCuts,
        setPlayerTime
      );
    }
  };

  return (
    <div className={styles.Transcription}>
      <div className={styles.TextControls}>
        <div className={styles.CutContainer} onClick={cutClickHandler}>
          <img src={cut} alt='cut' />
          <p>Cut</p>
        </div>
        <div className={styles.SearchContainer}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.SearchInput}
            placeholder='Search'
            type='text'
          />
          <img className={styles.SearchSvg} src={search} alt='search' />
        </div>
      </div>
      <div id='textbox' className={styles.Text}>
        {words ? (
          <Words
            wordsArr={words}
            currentWordIndex={currentWordIndex}
            searchInput={searchInput}
            wordClickHandler={wordClickHandler}
            inputIndex={inputIndex}
            setInputIndex={setInputIndex}
            currentSelection={currentSelection}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Transcription;
