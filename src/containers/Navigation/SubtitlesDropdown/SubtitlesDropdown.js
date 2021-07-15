import React, { useContext } from 'react';
import styles from './SubtitlesDropdown.module.css';
import AppContext from '../../../contexts/AppContext';
import { ReactComponent as SubtitlesOn } from '../../../assets/subtitlesOn.svg';
import { ReactComponent as SubtitlesOff } from '../../../assets/subtitlesOff.svg';

const SubtitlesDropdown = () => {
  const { appState, appDispatch } = useContext(AppContext);
  const clickHandler = (e) => {
    let data = true;
    if (e.currentTarget.id === 'subOff') data = false;
    appDispatch({ type: 'setIsSubtitles', data });
  };

  return (
    <div className={styles.Dropdown}>
      <p className={styles.Text}>Subtitles</p>
      <div className={styles.Buttons}>
        <div
          className={[
            styles.Button,
            !appState.isSubtitles ? styles.Active : null,
          ].join(' ')}
          id='subOff'
          onClick={clickHandler}
        >
          <SubtitlesOff fill={!appState.isSubtitles ? '#6F7BD0' : '#000000'} />
          <p className={styles.ButtonText}>Off</p>
        </div>
        <div
          className={[
            styles.Button,
            appState.isSubtitles ? styles.Active : null,
          ].join(' ')}
          id='subOn'
          onClick={clickHandler}
        >
          <SubtitlesOn fill={appState.isSubtitles ? '#6F7BD0' : '#000000'} />
          <p className={styles.ButtonText}>On</p>
        </div>
      </div>
    </div>
  );
};

export default SubtitlesDropdown;
