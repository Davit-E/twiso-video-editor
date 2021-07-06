import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoEditor.module.css';
import Navigation from '../Navigation/Navigation';
import Transcription from '../Transcription/Transcription';
import Player from '../Player/Player';
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [viedoForUpload, setVideoForUpload] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [videoCuts, setVideoCuts] = useState([]);
  const [nextCutIndex, setNextCutIndex] = useState(null);

  const [canvas, setCanvas] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (viedoForUpload) {
      handleUpload(viedoForUpload, setVideoForUpload, uploadVideo);
      videoRef.current.src = URL.createObjectURL(viedoForUpload);
    }
  }, [viedoForUpload, uploadVideo]);

  // useEffect(() => {
  //   console.log(nextCutIndex);
  // }, [nextCutIndex]);

  // useEffect(() => {
  //   console.log(currentWordIndex);
  // }, [currentWordIndex]);

  const handlePlay = (e) => {
    let selection = document.getSelection();
    selection.removeAllRanges();
    if (currentSelection) setCurrentSelection(null);
    setIsPlaying(true);
    let interval = setInterval(() => {
      setCurrentTime(videoRef.current.currentTime);
    }, 10);
    setIntervalId(interval);
  };

  const handlePause = (e) => {
    setIsPlaying(false);
    clearInterval(intervalId);
  };

  const handleEnd = (e) => {
    if (videoCuts.length > 0) setNextCutIndex(0);
    let word = words[0];
    let index = 0;
    let start = word.start;
    if (word.deleted && word.next !== null) {
      index = word.next;
      start = words[index].start;
    }
    setCurrentWordIndex(index);
    setCurrentTime(+start);
    // console.log('start time: ', start);
    // console.log('start index: ', index);
    // console.log(words);
  };

  const setPlayerTime = (wordIndex) => {
    let endTime = '0';
    if (wordIndex !== null) {
      let word = words[wordIndex];
      endTime = word.end;
      videoRef.current.currentTime = word.start;
      setCurrentTime(+word.start);
      // console.log('seting player time: ', word.start);
    }
    let cutIndex = 0;
    for (let i = 0; i < videoCuts.length; i++) {
      let cut = videoCuts[i];
      if (+endTime > +cut.end) {
        cutIndex++;
      }
    }
    setNextCutIndex(cutIndex);
  };

  const handleVideoCuts = useCallback(
    (time) => {
      time = +time + 0.05;
      if (videoCuts.length > 0 && nextCutIndex !== null) {
        if (
          videoCuts[nextCutIndex] &&
          time >= +videoCuts[nextCutIndex].start &&
          time <= +videoCuts[nextCutIndex].end
        ) {
          videoRef.current.currentTime = videoCuts[nextCutIndex].end;
          if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
        }
      }
    },
    [videoCuts, nextCutIndex]
  );

  const handleCurrentTime = useCallback(
    (time, index) => {
      time = +time + 0.05;
      let word = words[index];
      let nextWord = words[index + 1];
      // if (word) {
      //   console.log('comparing: ', time, '>', +word.end, time >= +word.end);
      // }
      if (index !== null && nextWord && time > +word.end) {
        let isShortTime = +word.end - word.start <= 0.05 && !isPlaying;
        if (!isShortTime && nextWord.deleted && nextWord.next !== null) {
          videoRef.current.currentTime = words[nextWord.next].start;
          setCurrentWordIndex(nextWord.next);
        } else if (!isShortTime) {
          setCurrentWordIndex((prevState) => prevState + 1);
        }
      }
    },
    [words, isPlaying]
  );

  useEffect(() => {
    if (currentTime !== null) handleCurrentTime(currentTime, currentWordIndex);
  }, [currentTime, handleCurrentTime, currentWordIndex]);

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
          currentWordIndex={currentWordIndex}
          setCurrentWordIndex={setCurrentWordIndex}
          isPlaying={isPlaying}
          videoRef={videoRef}
          setCuts={setVideoCuts}
          currentSelection={currentSelection}
          setCurrentSelection={setCurrentSelection}
          setPlayerTime={setPlayerTime}
          // duration={duration}
          // fullText={fullText}
        />
        <Player
          viedoForUpload={viedoForUpload}
          videoRef={videoRef}
          handleEnd={handleEnd}
          handlePause={handlePause}
          handlePlay={handlePlay}
          canvas={canvas}
          setCanvas={setCanvas}
          duration={duration}
        />
      </main>
    </div>
  );
};

export default VideoEditor;
