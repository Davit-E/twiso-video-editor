import React, { useEffect, useRef, useState } from 'react';
import styles from './Preview.module.css';
import Navbar from '../../components/Navbar/Navbar';
import exportArrow from '../../assets/preview/exportArrow.svg';
import copyLink from '../../assets/preview/copyLink.svg';
import { generateText, exportText, downloadVideo } from './utils/previewUtils';
import CustomPlayer from '../CustomPlayer/CustomPlayer';
import useGetVideo from '../../hooks/useGetVideo';
import { useParams, useHistory } from 'react-router-dom';
import Spinner from '../../components/Spinner2/Spinner';

const Preview = () => {
  const { getVideo, words, info, getVideoError } = useGetVideo();
  const [article, setArticle] = useState(null);
  const videoDownloadRef = useRef(null);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    if (params && params.id) getVideo(params.id);
  }, [params, getVideo]);

  useEffect(() => {
    if (getVideoError || (info && !info.finalUrl)) history.push('/home');
  }, [getVideoError, info, history]);

  useEffect(() => {
    if (words) setArticle(generateText(words));
  }, [words]);

  const downloadVideoHandler = () => {
    // videoDownloadRef.current.click();
  };

  return (
    <div className={styles.Preview}>
      {info && info.finalUrl ? (
        <>
          <Navbar videoData={info} isPreview={true} />
          <main className={styles.Main}>
            <div className={styles.MainContent}>
              <div className={styles.CustomPlayer}>
                <CustomPlayer url={info.finalUrl} />
                <a
                  ref={videoDownloadRef}
                  style={{ display: 'none' }}
                  download={`${info.title}.mp4`}
                  href={info.finalUrl}
                >
                  Download Video
                </a>
              </div>
              <div className={styles.VideoFooter}>
                <p className={styles.Title}>{info.title}</p>
                <div className={styles.DownloadAndLink}>
                  <button
                    className={styles.Download}
                    // onClick={() => downloadVideo(info.finalUrl, info.title)}
                    onClick={downloadVideoHandler}
                  >
                    Download
                  </button>
                  <button className={styles.CopyLink}>
                    <img src={copyLink} alt='copy' />
                    <span>Copy public link</span>
                  </button>
                </div>
              </div>
              <div className={styles.HeadlineAndExport}>
                <p className={styles.Headline}>
                  Give your articale a headline!
                </p>
                <button
                  className={styles.ExportButton}
                  onClick={() => exportText(article, info.title)}
                >
                  <span>Export text</span>
                  <img src={exportArrow} alt='arrow' />
                </button>
              </div>
              <p className={styles.Text}>{article}</p>
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
