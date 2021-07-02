import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoEditor.module.css';
import Navigation from '../Navigation/Navigation';
import Transcription from '../Transcription/Transcription';
import useUploadVideo from '../../hooks/useUploadVideo';
// import { words } from './sampleWords';

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
  const { isUploading, uploadVideo, words, duration, fullText } =
    useUploadVideo();
  const [currentSelection, setCurrentSelection] = useState(null);
  const [currentWordId, setCurrentWordId] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const [nextCutIndex, setNextCutIndex] = useState(0);
  const playerRef = useRef(null);

  // useEffect(() => {
  //   videoCuts.forEach((el) => {
  //     console.log(el);
  //   });
  //   console.log('//////////////////////////////');
  // }, [videoCuts]);

  useEffect(() => {
    if (viedoForUpload) {
      handleUpload(viedoForUpload, setVideoForUpload, uploadVideo);
      playerRef.current.src = URL.createObjectURL(viedoForUpload);
    }
  }, [viedoForUpload, uploadVideo]);

  useEffect(() => {
    if (words) setCurrentWordId(words[0].id);
  }, [words]);

  const handlePlay = (e) => {
    let selection = document.getSelection();
    selection.removeAllRanges();
    if (currentSelection) setCurrentSelection(null);
    setIsPlaying(true);
    let interval = setInterval(() => {
      setCurrentTime(playerRef.current.currentTime);
    }, 10);
    setIntervalId(interval);
  };

  const handlePause = (e) => {
    setIsPlaying(false);
    clearInterval(intervalId);
  };

  const setPlayerTime = (wordId) => {
    let endTime = '0';
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (wordId === word.id) {
        endTime = word.end;
        playerRef.current.currentTime = word.start;
        break;
      }
    }

    let cutIndex = 0;
    for (let i = 0; i < videoCuts.length; i++) {
      let cut = videoCuts[i];
      if (+endTime > +cut.start) {
        cutIndex++;
      }
    }
    // console.log(cutIndex);
    setNextCutIndex(cutIndex);
  };

  useEffect(() => {
    // console.log(currentWordId);
  }, [currentWordId]);

  const handleCurrentTime = useCallback((time) => {
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
  }, [words]);

  // const handleCurrentTime = useCallback(
  //   (time) => {
  //     let shouldSet = true;
  //     time = `${+time + 0.05}`;
  //     if (videoCuts.length > 0 && nextCutIndex !== null) {
  //       if (
  //         videoCuts[nextCutIndex] &&
  //         +time >= +videoCuts[nextCutIndex].start &&
  //         +time <= +videoCuts[nextCutIndex].end
  //       ) {
  //         playerRef.current.currentTime = videoCuts[nextCutIndex].end;
  //         if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
  //         else setNextCutIndex(null);
  //         shouldSet = false;
  //       }
  //     }

  //     if (shouldSet) {
  //       for (let i = 0; i < words.length; i++) {
  //         let word = words[i];
  //         if (+word.start <= +time && +word.end >= +time && !word.deleted) {
  //           setCurrentWordId(word.id);
  //           console.log('setting word id from handle time');
  //           break;
  //         }
  //       }
  //     }
  //   },
  //   [videoCuts, nextCutIndex]
  // );

  useEffect(() => {
    if (currentTime) handleCurrentTime(currentTime);
  }, [currentTime, handleCurrentTime]);

  return (
    <div className={styles.VideoEditor}>
      <Navigation
        setVideoForUpload={setVideoForUpload}
        isUploading={isUploading}
      />
      <main className={styles.Main}>
        <Transcription
          className={styles.VideoEditor}
          words={words}
          currentWordId={currentWordId}
          setCurrentWordId={setCurrentWordId}
          isPlaying={isPlaying}
          playerRef={playerRef}
          setCuts={setVideoCuts}
          currentSelection={currentSelection}
          setCurrentSelection={setCurrentSelection}
          setPlayerTime={setPlayerTime}
          // duration={duration}
          // fullText={fullText}
        />
        <div className={styles.Player}>
          <video
            style={{ display: duration ? 'block' : 'none' }}
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
