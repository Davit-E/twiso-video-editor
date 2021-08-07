import React, { useContext } from 'react';
import styles from './SubtitlesDropdown.module.css';
import EditorContext from '../../../contexts/EditorContext';
import { ReactComponent as SubtitlesOn } from '../../../assets/editor/subtitlesOn.svg';
import { ReactComponent as SubtitlesOff } from '../../../assets/editor/subtitlesOff.svg';

const SubtitlesDropdown = () => {
  const { editorState, editorDispatch } = useContext(EditorContext);
  const clickHandler = (e) => {
    let data = true;
    if (e.currentTarget.id === 'subOff') data = false;
    editorDispatch({ type: 'setIsSubtitles', data });
  };

  return (
    <div className={styles.Dropdown}>
      <p className={styles.Text}>Subtitles</p>
      <div className={styles.Buttons}>
        <div
          className={[
            styles.Button,
            !editorState.isSubtitles ? styles.Active : null,
          ].join(' ')}
          id='subOff'
          onClick={clickHandler}
        >
          <SubtitlesOff fill={!editorState.isSubtitles ? '#6F7BD0' : '#000000'} />
          <p className={styles.ButtonText}>Off</p>
        </div>
        <div
          className={[
            styles.Button,
            editorState.isSubtitles ? styles.Active : null,
          ].join(' ')}
          id='subOn'
          onClick={clickHandler}
        >
          <SubtitlesOn fill={editorState.isSubtitles ? '#6F7BD0' : '#000000'} />
          <p className={styles.ButtonText}>On</p>
        </div>
      </div>
    </div>
  );
};

export default SubtitlesDropdown;
