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
  currentWordId,
  setCurrentWordId,
  isPlaying,
  playerRef,
  setCuts,
  currentSelection,
  setCurrentSelection,
  setPlayerTime,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [inputId, setInputId] = useState(null);

  const wordClickHandler = (e, isDeleted) => {
    let id = e.currentTarget.id;
    if (isPlaying) playerRef.current.pause();
    if (e.detail > 1 && !inputId) setInputId(id);
    if (!isDeleted && !inputId) {
      setCurrentSelection(null);
      setPlayerTime(id);
      setCurrentWordId(id);
    } else if (!inputId) {
      restoreDeleted(
        words,
        id,
        setCurrentWordId,
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
        if (anchorNode.parentNode.id) {
          setPlayerTime(anchorNode.parentNode.id);
          setCurrentWordId(anchorNode.parentNode.id);
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
        setCurrentSelection({ start, end });
        setPlayerTime(start);
        setCurrentWordId(start);
      }
      selection.removeAllRanges();
    },
    [setCurrentWordId, setCurrentSelection, setPlayerTime]
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
          if (isPlaying) playerRef.current.pause();
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
    [handleSelection, isPlaying, playerRef]
  );

  useEffect(() => {
    document.addEventListener('mouseup', mouseUpHandler);
    return () => document.removeEventListener('mouseup', mouseUpHandler);
  }, [mouseUpHandler]);

  const cutClickHandler = () => {
    if (isPlaying) playerRef.current.pause();
    if (!currentSelection && currentWordId) {
      deleteWord(
        words,
        currentWordId,
        setCurrentWordId,
        setCuts,
        setPlayerTime
      );
    } else if (currentSelection) {
      deleteSelection(
        words,
        setCurrentWordId,
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
            currentWordId={currentWordId}
            searchInput={searchInput}
            wordClickHandler={wordClickHandler}
            inputId={inputId}
            setInputId={setInputId}
            currentSelection={currentSelection}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Transcription;
