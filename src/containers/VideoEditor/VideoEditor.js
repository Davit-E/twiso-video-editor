import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoEditor.module.css';
import Navigation from '../Navigation/Navigation';
import Transcription from '../Transcription/Transcription';
// import useUploadVideo from '../../hooks/useUploadVideo';
import { words } from './sampleWords';

const handleUpload = async (file, setFile, upload) => {
  const formData = new FormData();
  formData.append('video', file);
  try {
    await upload(formData);
  } catch (err) {
    console.log(err);
  } finally {
    setFile(null);
  }
};

const VideoEditor = () => {
  // const { isUploading, uploadVideo, words, duration, fullText } =
  //   useUploadVideo();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentWordId, setCurrentWordId] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [cuts, setCuts] = useState([]);
  const playerRef = useRef(null);
  useEffect(() => {
    if (viedoForUpload) {
      // handleUpload(viedoForUpload, setVideoForUpload);
      playerRef.current.src = URL.createObjectURL(viedoForUpload);
    }
  }, [viedoForUpload]);

  useEffect(() => {
    if (words) {
      setCurrentWordId(words[0].id);
    }
  }, []);

  const handlePlay = (e) => {
    let selection = document.getSelection();
    selection.removeAllRanges();
    if (currentSelection) setCurrentSelection(null);
    setIsPlaying(true);
    let interval = setInterval(() => {
      setCurrentTime(playerRef.current.currentTime);
    }, 100);
    setIntervalId(interval);
  };

  const handlePause = (e) => {
    setIsPlaying(false);
    clearInterval(intervalId);
  };

  const setPlayerTime = (wordId) => {
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (wordId === word.id) {
        playerRef.current.currentTime = word.start;
        break;
      }
    }
  };

  const handleCurrentTime = useCallback(
    (time) => {
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (word.start <= time && word.end >= time) {
          if (word.deleted && words[i - 1] && !words[i - 1].deleted) {
            for (let j = i; j < words.length; j++) {
              let newWord = words[j];
              if (newWord.deleted && words[j + 1] && !words[j + 1].deleted) {
                playerRef.current.currentTime = `${+newWord.end}`;
                break;
              } else if (!words[j + 1]) {
                playerRef.current.currentTime = `${+newWord.end}`;
              }
            }
          } else if (!word.deleted) {
            setCurrentWordId(word.id);
            break;
          }
        }
      }
    },
    []
  );

  useEffect(() => {
    if (words) {
      handleCurrentTime(currentTime);
    }
  }, [currentTime, handleCurrentTime]);

  return (
    <div className={styles.VideoEditor}>
      <Navigation
        setVideoForUpload={setVideoForUpload}
        // isUploading={isUploading}
      />
      <main className={styles.Main}>
        <Transcription
          className={styles.VideoEditor}
          words={words}
          currentWordId={currentWordId}
          setCurrentWordId={setCurrentWordId}
          isPlaying={isPlaying}
          playerRef={playerRef}
          setCuts={setCuts}
          currentSelection={currentSelection}
          setCurrentSelection={setCurrentSelection}
          setPlayerTime={setPlayerTime}
          // duration={duration}
          // fullText={fullText}
        />
        <div className={styles.Player}>
          <video
            style={{ display: viedoForUpload ? 'block' : 'none' }}
            className={styles.Video}
            ref={playerRef}
            controls
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>
      </main>
    </div>
  );
};

export default VideoEditor;
