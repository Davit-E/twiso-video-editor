import React, { useMemo } from 'react';
import styles from './Preview.module.css';
import Navbar from '../../components/Navbar/Navbar';
import exportArrow from '../../assets/preview/exportArrow.svg';
import copyLink from '../../assets/preview/copyLink.svg';
import { generateText, exportText, downloadVideo } from './utils/previewUtils';
import CustomPlayer from '../CustomPlayer/CustomPlayer';

const Preview = ({ previewUrl, setPreviewUrl, words }) => {
  const article = useMemo(() => generateText(words), [words]);
  console.log('Rerender');

  return (
    <div className={styles.Preview}>
      <Navbar setPreviewUrl={setPreviewUrl} />
      <main className={styles.Main}>
        <div className={styles.MainContent}>
          <div className={styles.CustomPlayer}>
            <CustomPlayer url={previewUrl} />
          </div>
          <div className={styles.VideoFooter}>
            <p className={styles.Title}>Untitled</p>
            <div className={styles.DownloadAndLink}>
              <button
                className={styles.Download}
                onClick={() => downloadVideo(previewUrl)}
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
            <p className={styles.Headline}>Give your articale a hedline!</p>
            <button
              className={styles.ExportButton}
              onClick={() => exportText(article)}
            >
              <span>Export text</span>
              <img src={exportArrow} alt='arrow' />
            </button>
          </div>
          <p className={styles.Text}>{article}</p>
        </div>
      </main>
    </div>
  );
};

export default Preview;
