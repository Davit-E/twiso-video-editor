import React, { useState, useCallback, useRef } from 'react';
import styles from './Editor.module.css';
import Uploader from '../Uploader/Uploader';
import VideoEditor from '../VideoEditor/VideoEditor';
import { useRouteMatch, Switch, Redirect } from 'react-router-dom';
import CustomRoute from '../../components/CustomRoute/CustomRoute';
import SelectSpeakers from '../SelectSpeakers/SelectSpeakers';
// import UploaderMock from '../UploaderMock/UploaderMock';

const Editor = () => {
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const match = useRouteMatch();
  const words = useRef(null);

  const clearState = useCallback(() => {
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
          allowed={!videoData}
          component={Uploader}
          // component={UploaderMock}
          viedoForUpload={viedoForUpload}
          setVideoForUpload={setVideoForUpload}
          setVideoData={setVideoData}
          clearState={clearState}
          wordsRef={words}
        />
        <CustomRoute
          path={`${match.path}/speakers`}
          redirect={`/home`}
          where='in the Editor speakers route'
          allowed={!!videoData}
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
          speakers={speakers}
        />
        {/* <CustomRoute
          path={`${match.path}/video-editor`}
          redirect={`${match.path}/new`}
          where='in the Editor video-editor route'
          allowed={isUploaded}
          component={VideoEditor}
          words={words.current}
          info={videoData}
          speakers={speakers}
        /> */}
        <Redirect to={`${match.path}/new`} />
      </Switch>
    </div>
  );
};

export default Editor;
