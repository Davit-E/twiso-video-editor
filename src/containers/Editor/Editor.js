import React, { useState, useRef, useCallback } from 'react';
import styles from './Editor.module.css';
import Uploader from '../Uploader/Uploader';
import VideoEditor from '../VideoEditor/VideoEditor';
import { useRouteMatch, Switch, Redirect } from 'react-router-dom';
import CustomRoute from '../../components/CustomRoute/CustomRoute';
import SelectSpeakers from '../SelectSpeakers/SelectSpeakers';
// import UploaderMock from '../UploaderMock/UploaderMock';

const Editor = () => {
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isFinishedTranscribing, setIsFinishedTranscribing] = useState(false);
  const [duration, setDuration] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const videoRef = useRef(null);
  const match = useRouteMatch();
  const words = useRef(null);

  const clearState = useCallback(() => {
    words.current = null;
    setDuration(null);
    setVideoUrl(null);
    setIsFinishedTranscribing(false);
    setVideoForUpload(null);
    setSpeakers([])
  }, []);

  return (
    <div className={styles.Editor}>
      <Switch>
        <CustomRoute
          path={`${match.path}/new`}
          redirect={`${match.path}/speakers`}
          /////////////////////////////////////////
          // redirect={`${match.path}/video-editor`}
          where='in the Editor new route'
          allowed={!isFinishedTranscribing}
          component={Uploader}
          // component={UploaderMock}
          viedoForUpload={viedoForUpload}
          setVideoForUpload={setVideoForUpload}
          setIsFinished={setIsFinishedTranscribing}
          setVideoUrl={setVideoUrl}
          setDuration={setDuration}
          wordsRef={words}
          clearState={clearState}
        />
        <CustomRoute
          path={`${match.path}/speakers`}
          redirect={`${match.path}/video-editor`}
          where='in the Editor speakers route'
          allowed={isFinishedTranscribing}
          component={SelectSpeakers}
          videoUrl={videoUrl}
          duration={duration}
          setSpeakers={setSpeakers}
        />
        <CustomRoute
          path={`${match.path}/video-editor`}
          redirect={`${match.path}/new`}
          where='in the Editor video-editor route'
          allowed={isFinishedTranscribing}
          component={VideoEditor}
          viedoForUpload={viedoForUpload}
          videoUrl={videoUrl}
          words={words.current}
          videoRef={videoRef}
          duration={duration}
          speakers={speakers}
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
