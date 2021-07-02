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
  // const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const [nextCutIndex, setNextCutIndex] = useState(null);
  const playerRef = useRef(null);

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

  const handleEnd = (e) => {
    if (videoCuts.length > 0) setNextCutIndex(0);
    setCurrentTime(0);
  };

  const setPlayerTime = (wordId, cuts) => {
   cuts = videoCuts
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
    for (let i = 0; i < cuts.length; i++) {
      let cut = cuts[i];
      if (+endTime > +cut.end) {
        cutIndex++;
      }
    }
    setNextCutIndex(cutIndex);
  };

  useEffect(() => {
    console.log(nextCutIndex);
  }, [nextCutIndex]);

  // const handleCurrentTime = useCallback(
  //   (time) => {
  //     let word = words[currentWordIndex];
  //     if (+word.start <= +time && +word.end >= +time && !word.deleted) {
  //       setCurrentWordIndex((prevState) => prevState + 1);
  //     }
  //   },
  //   [currentWordIndex]
  // );

  // const handleCurrentWordUpdate = useCallback((currentWordId) => {
  //   for (let i = 0; i < words.length; i++) {
  //     let word = words[i];
  //     if (currentWordId === word.id) {
  //       setCurrentWordIndex(i);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (currentWordId) handleCurrentWordUpdate(currentWordId);
  // }, [currentWordId, handleCurrentWordUpdate]);

  const handleVideoCuts = useCallback(
    (time) => {
      time = time + 0.05;
      if (videoCuts.length > 0 && nextCutIndex !== null) {
        if (
          videoCuts[nextCutIndex] &&
          time >= +videoCuts[nextCutIndex].start &&
          time <= +videoCuts[nextCutIndex].end
        ) {
          playerRef.current.currentTime = videoCuts[nextCutIndex].end;
          if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
        }
      }
    },
    [videoCuts, nextCutIndex]
  );

  const handleCurrentTime = useCallback((time) => {
    time = time + 0.05;
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (+word.start <= time && +word.end >= time && !word.deleted) {
        setCurrentWordId(word.id);
        break;
      }
    }
  }, [words]);

  useEffect(() => {
    if (currentTime !== null) handleCurrentTime(currentTime);
  }, [currentTime, handleCurrentTime]);

  useEffect(() => {
    if (currentTime !== null) handleVideoCuts(currentTime);
  }, [currentTime, handleVideoCuts]);

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
            onEnded={handleEnd}
          />
        </div>
      </main>
    </div>
  );
};

export default VideoEditor;
