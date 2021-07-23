import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './VideoEditor.module.css';
import Navigation from '../Navigation/Navigation';
import Transcription from '../Transcription/Transcription';
import Player from '../Player/Player';
import useUploadVideo from '../../hooks/useUploadVideo';
// import { words } from './sampleWords2';

const handleUpload = async (file, setFile, upload) => {
  const formData = new FormData();
  formData.append('video', file);
  try {
    await upload(formData);
  } catch (err) {
    console.log(err);
  } finally {
    // setFile(null);
  }
};

const VideoEditor = () => {
  const { isUploading, uploadVideo, words, duration, fullText } = useUploadVideo();
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
    }
  }, [viedoForUpload, uploadVideo]);

  // useEffect(() => {
  //   console.log(nextCutIndex);
  // }, [nextCutIndex]);

  // useEffect(() => {
  //   console.log(currentWordIndex);
  // }, [currentWordIndex]);

  // useEffect(() => {
  //   videoCuts.forEach((el) => {
  //     console.log(el);
  //   });
  // }, [videoCuts]);

  const handlePlay = (e) => {
    let selection = document.getSelection();
    selection.removeAllRanges();
    if (currentSelection) setCurrentSelection(null);
    setIsPlaying(true);
    let interval = setInterval(() => {
      // console.log('interval: ', videoRef.current.currentTime);
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
      videoRef.current.currentTime = +word.start;
      setCurrentTime(+word.start);
      console.log('seting player time: ', +word.start);
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
      if (
        videoCuts.length > 0 &&
        nextCutIndex !== null &&
        videoCuts[nextCutIndex]
      ) {
        console.log(videoCuts[nextCutIndex]);
        console.log(
          'comparing: ',
          time,
          '>=',
          +videoCuts[nextCutIndex].start,
          time >= +videoCuts[nextCutIndex].start
        );
        console.log(
          'comparing: ',
          time,
          '<=',
          +videoCuts[nextCutIndex].end,
          time <= +videoCuts[nextCutIndex].end
        );
      }
      if (videoCuts.length > 0 && videoCuts[nextCutIndex]) {
        time = +time + 0.05;
        let moreThanStart = time >= +videoCuts[nextCutIndex].start;
        let lessThanEnd = time <= +videoCuts[nextCutIndex].end;
        let isShortTime =
          +videoCuts[nextCutIndex].end - videoCuts[nextCutIndex].start <=
            0.05 && moreThanStart;
        if ((moreThanStart && lessThanEnd) || isShortTime) {
          videoRef.current.currentTime = +videoCuts[nextCutIndex].end;
          console.log(
            `%c setting to: ${+videoCuts[nextCutIndex].end}`,
            'background:red; color:white'
          );

          if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
          else setNextCutIndex(null);
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
          // videoRef.current.currentTime = words[nextWord.next].start;
          // if (videoCuts[nextCutIndex + 1]) setNextCutIndex(nextCutIndex + 1);
          setCurrentWordIndex(nextWord.next);
        } else if (!isShortTime) {
          setCurrentWordIndex((prevState) => prevState + 1);
        }
      }
    },
    [isPlaying, words]
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
        viedoForUpload={viedoForUpload}
        setVideoForUpload={setVideoForUpload}
        isUploading={isUploading}
        canvas={canvas}
        videoRef={videoRef}
        videoCuts={videoCuts}
        duration={duration}
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
        {words ? (
          <Player
            viedoForUpload={viedoForUpload}
            videoRef={videoRef}
            handleEnd={handleEnd}
            handlePause={handlePause}
            handlePlay={handlePlay}
            canvas={canvas}
            setCanvas={setCanvas}
            duration={duration}
            isPlaying={isPlaying}
          />
        ) : null}
        {/* <div className={styles.DownloadCanvas}>
          <canvas id='downloadCanvas' />
        </div> */}
      </main>
    </div>
  );
};

export default VideoEditor;
