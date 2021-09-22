import React, { useState, useCallback } from 'react';
import styles from './Editor.module.css';
import Uploader from '../Uploader/Uploader';
import VideoEditor from '../VideoEditor/VideoEditor';
import { useRouteMatch, Switch, Redirect } from 'react-router-dom';
import CustomRoute from '../../components/CustomRoute/CustomRoute';
import SelectSpeakers from '../SelectSpeakers/SelectSpeakers';
import UploaderMock from '../UploaderMock/UploaderMock';

const Editor = () => {
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isFinishedTranscribing, setIsFinishedTranscribing] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const match = useRouteMatch();

  const clearState = useCallback(() => {
    setIsFinishedTranscribing(false);
    setVideoForUpload(null);
    setSpeakers([]);
    setVideoData(null);
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
          setVideoData={setVideoData}
          clearState={clearState}
        />
        <CustomRoute
          path={`${match.path}/speakers`}
          redirect={`/home`}
          where='in the Editor speakers route'
          allowed={isFinishedTranscribing}
          component={SelectSpeakers}
          videoData={videoData}
          setSpeakers={setSpeakers}
        />
        <CustomRoute
          path={`${match.path}/:id`}
          redirect={`/home`}
          where='in the Editor project id route'
          allowed={true}
          component={VideoEditor}
          viedoForUpload={viedoForUpload}
          speakers={speakers}
        />
        <Redirect to={`${match.path}/new`} />
      </Switch>
    </div>
  );
};

export default Editor;
