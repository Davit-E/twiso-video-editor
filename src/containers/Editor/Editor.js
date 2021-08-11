import React, { useState, useRef, useCallback } from 'react';
import styles from './Editor.module.css';
import Uploader from '../Uploader/Uploader';
import VideoEditor from '../VideoEditor/VideoEditor';
import { useRouteMatch, Switch, Redirect } from 'react-router-dom';
import CustomRoute from '../../components/CustomRoute/CustomRoute';
// import { words } from './sampleWords/sampleWords';

const Editor = () => {
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const [canvas, setCanvas] = useState(null);
  const [subArr, setSubArr] = useState(null);
  const [currentSub, setCurrentSub] = useState(null);
  const [isFinishedTranscribing, setIsFinishedTranscribing] = useState(false);
  const [duration, setDuration] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const match = useRouteMatch();
  const words = useRef(null);

  const clearState = useCallback(() => {
    words.current = null;
    setDuration(null);
    setVideoUrl(null);
    setIsFinishedTranscribing(false);
    setCanvas(null);
    setSubArr(null);
    setVideoCuts(null);
    setVideoForUpload(null);
    setCurrentSub(null);
  }, []);

  // useEffect(() => {
  //   if (isFinishedTranscribing) history.push(`${match.path}/video-editor`);
  // }, [isFinishedTranscribing, history, match]);

  return (
    <div className={styles.Editor}>
      <Switch>
        <CustomRoute
          path={`${match.path}/new`}
          redirect={`${match.path}/video-editor`}
          where='in the Editor new route'
          allowed={!isFinishedTranscribing}
          component={Uploader}
          viedoForUpload={viedoForUpload}
          setVideoForUpload={setVideoForUpload}
          setIsFinished={setIsFinishedTranscribing}
          setVideoUrl={setVideoUrl}
          setDuration={setDuration}
          wordsRef={words}
        />
        <CustomRoute
          path={`${match.path}/video-editor`}
          redirect={`${match.path}/new`}
          where='in the Editor video-editor route'
          allowed={isFinishedTranscribing}
          component={VideoEditor}
          canvas={canvas}
          setCanvas={setCanvas}
          subArr={subArr}
          setSubArr={setSubArr}
          currentSub={currentSub}
          setCurrentSub={setCurrentSub}
          videoCuts={videoCuts}
          setVideoCuts={setVideoCuts}
          viedoForUpload={viedoForUpload}
          videoUrl={videoUrl}
          words={words.current}
          videoRef={videoRef}
          duration={duration}
          clearState={clearState}
        />
        <Redirect to={`${match.path}/new`} />
        {/* <Redirect
              to={`${match.path}${
                isFinishedTranscribing ? '/video-editor' : '/new'
              }`}
            /> */}
      </Switch>
    </div>
  );
};

export default Editor;
