import React, { useState, useRef, useEffect } from 'react';
import styles from './SelectSpeakers.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { useHistory } from 'react-router-dom';
import useContainerSize from '../../hooks/useContainerSize';
import { getVideoSize } from '../../utils/getSize';
import addSpeaker from '../../assets/editor/addSpeaker.svg';
import removeSpeaker from '../../assets/editor/removeSpeaker.svg';
import SpeakersCanvas from '../Canvas/SpeakersCanvas/SpeakersCanvas';
import SpeakersContext from '../../contexts/SpeakersContext';
import useSpeakersState from '../../hooks/useSpeakersState';

const SelectSpeakers = ({ videoData, setSpeakers }) => {
  const [speakersState, speakersDispatch] = useSpeakersState();
  const history = useHistory();
  const [canvas, setCanvas] = useState(null);
  const [containerSize, setContainerSize] = useState(null);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [videoSize, setVideoSize] = useState(null);
  const [boxArr, setBoxArr] = useState([]);
  const containerPadding = 200;

  useEffect(() => {
    setSpeakers([]);
  }, [setSpeakers]);

  useContainerSize(
    videoSize,
    containerSize,
    speakersDispatch,
    containerRef,
    setContainerSize,
    containerPadding
  );

  const addSpeakerHandler = () => {
    speakersDispatch({ type: 'setShouldAddSpeaker', data: true });
  };

  const removeSpeakerHandler = () => {
    speakersDispatch({ type: 'setShouldRemoveSpeaker', data: true });
  };

  const confirmHandler = () => {
    let arr = [];
    for (let i = 0; i < boxArr.length; i++) {
      const box = boxArr[i];
      let w = box.width * box.scaleX;
      let h = box.height * box.scaleY;
      let x = box.lineCoords.tl.x / canvas.getZoom();
      let y = box.lineCoords.tr.y / canvas.getZoom();
      arr.push({ x, y, w, h });
    }
    setSpeakers(arr);
    history.push(`/editor/${videoData.id}`);
    // history.push('/editor/video-editor');
  };

  const skipHandler = () => {
    setSpeakers([{ x: 0, y: 0, w: videoSize.width, h: videoSize.height }]);
    history.push(`/editor/${videoData.id}`);
    // history.push('/editor/video-editor');
  };

  return (
    <>
      <Navbar videoData={videoData} />
      <SpeakersContext.Provider value={{ speakersState, speakersDispatch }}>
        <div className={styles.SelectSpeakers} ref={containerRef}>
          <h1 className={styles.Heading}>Select area with speakers</h1>
          <SpeakersCanvas
            canvas={canvas}
            setCanvas={setCanvas}
            canvasState={speakersState}
            canvasDispatch={speakersDispatch}
            videoRef={videoRef}
            boxArr={boxArr}
            setBoxArr={setBoxArr}
            duration={videoData ? videoData.duration : null}
          />
          <video
            src={videoData ? videoData.url : null}
            width={videoSize ? videoSize.width : 0}
            height={videoSize ? videoSize.height : 0}
            id='video'
            preload='auto'
            className={styles.Video}
            ref={videoRef}
            onLoadedMetadata={() => getVideoSize(videoRef, setVideoSize)}
          />
          <p className={styles.SelectedText}>
            <span className={styles.SelectedNumber}>{boxArr.length}</span>
            {` speaker${boxArr.length !== 1 ? 's' : ''} selected`}
          </p>
          <div className={styles.SpeakerButtons}>
            <div className={styles.AddSpeakerButton}>
              <button
                className={styles.AddSpeakers}
                onClick={addSpeakerHandler}
              >
                <img src={addSpeaker} alt='add' />
              </button>
              <p className={styles.AddSpeakersText}>Add speakers</p>
            </div>
            <div className={styles.RemoveSpeakerButton}>
              <button
                className={styles.RemoveSpeakers}
                onClick={removeSpeakerHandler}
              >
                <img src={removeSpeaker} alt='add' />
              </button>
              <p className={styles.RemoveSpeakersText}>Remove</p>
            </div>
          </div>
          <div className={styles.NextSteps}>
            <button className={styles.Confirm} onClick={confirmHandler}>
              Confirm
            </button>
            <button className={styles.Skip} onClick={skipHandler}>
              Skip
            </button>
          </div>
        </div>
      </SpeakersContext.Provider>
    </>
  );
};

export default SelectSpeakers;
