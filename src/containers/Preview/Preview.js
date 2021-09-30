import React, { useEffect, useRef, useState, useContext } from 'react';
import styles from './Preview.module.css';
import Navbar from '../../components/Navbar/Navbar';
import exportArrow from '../../assets/preview/exportArrow.svg';
import copyLink from '../../assets/preview/copyLink.svg';
import { exportText } from './utils/previewUtils';
import CustomPlayer from '../CustomPlayer/CustomPlayer';
import { useParams, useHistory } from 'react-router-dom';
import Spinner from '../../components/Spinner2/Spinner';
import useGetVideo from '../../hooks/useGetVideo';
import useGetPublicVideo from '../../hooks/useGetPublicVideo';
import UserContext from '../../contexts/UserContext';
import useCheckAuth from '../../hooks/useCheckAuth';

const Preview = () => {
  const { userDispatch } = useContext(UserContext);
  const { isChecking, isAuth } = useCheckAuth();
  const { getVideo, info, getVideoError } = useGetVideo();
  const { getPublicVideo, publicInfo, getPublicVideoError } =
    useGetPublicVideo();
  const [videoInfo, setVideoInfo] = useState(null);
  const [article, setArticle] = useState(null);
  const videoDownloadRef = useRef(null);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    if (info && info.finalText) {
      setVideoInfo({ ...info });
      setArticle(info.finalText);
    } else if (publicInfo && publicInfo.finalUrl) {
      setVideoInfo({ ...publicInfo });
    }
  }, [info, publicInfo]);

  useEffect(() => {
    if (getVideoError || (info && !info.finalUrl)) {
      let isId = params && params.id;
      if (isId) getPublicVideo(params.id);
    }
  }, [getVideoError, info, history, params, getPublicVideo]);

  useEffect(() => {
    if (getPublicVideoError || (publicInfo && !publicInfo.finalUrl)) {
      history.push('/home');
    }
  }, [publicInfo, history, getPublicVideoError]);

  useEffect(() => {
    let isId = params && params.id;
    if (!isChecking && !isAuth && isId) getPublicVideo(params.id);
    else if (!isChecking && isAuth && isId) getVideo(params.id);
  }, [isChecking, isAuth, params, getPublicVideo, getVideo, userDispatch]);

  const downloadVideoHandler = () => {
    videoDownloadRef.current.click();
  };

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className={styles.Preview}>
      {videoInfo && videoInfo.finalUrl ? (
        <>
          <Navbar
            videoData={videoInfo}
            isPreview={true}
            getVideoError={getVideoError}
            isAuth={isAuth}
          />
          <main className={styles.Main}>
            <div className={styles.MainContent}>
              <div className={styles.CustomPlayer}>
                <CustomPlayer url={videoInfo.finalUrl} />
                <a
                  ref={videoDownloadRef}
                  style={{ display: 'none' }}
                  href={`${process.env.REACT_APP_API_BASE_URL_TEST}/api/v1/public/videos/download/${params.id}`}
                >
                  Download Video
                </a>
              </div>
              <div className={styles.VideoFooter}>
                <p className={styles.Title}>{videoInfo.title}</p>
                <div className={styles.DownloadAndLink}>
                  <button
                    className={styles.Download}
                    onClick={downloadVideoHandler}
                  >
                    Download
                  </button>
                  <button className={styles.CopyLink} onClick={copyLinkHandler}>
                    <img src={copyLink} alt='copy' />
                    <span>Copy public link</span>
                  </button>
                </div>
              </div>
              {article ? (
                <>
                  <div className={styles.HeadlineAndExport}>
                    <p className={styles.Headline}>
                      Give your articale a headline!
                    </p>
                    <button
                      className={styles.ExportButton}
                      onClick={() => exportText(article, videoInfo.title)}
                    >
                      <span>Export text</span>
                      <img src={exportArrow} alt='arrow' />
                    </button>
                  </div>
                  <p className={styles.Text}>{article}</p>
                </>
              ) : null}
            </div>
          </main>
        </>
      ) : (
        <Spinner style={{ width: '100px', height: '100px' }} />
      )}
    </div>
  );
};

export default Preview;
