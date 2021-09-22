import React, { useEffect, useState } from 'react';
import styles from './Project.module.css';
import useUpdateTitle from '../../../../hooks/useUpdateTitle';
import Spinner from '../../../../components/Spinner2/Spinner';
import { Link } from 'react-router-dom';
import trash from '../../../../assets/preview/trash.svg';
import useDeleteVideo from '../../../../hooks/useDeleteVideo';

const Project = ({ video, setShouldFetch }) => {
  const [input, setInput] = useState(video.title || '');
  const { isUpdatingTitle, updateTitle, uploadResponse } = useUpdateTitle();
  const { isDeletingVideo, deleteVideoResponse, deleteVideo } =
    useDeleteVideo();

  const transformDate = (d) => {
    let date = new Date(d);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let dateString = `${day > 9 ? day : '0' + day}.${
      month > 9 ? month : '0' + month
    }.${year}`;
    return dateString;
  };

  const blurHandler = (e) => {
    let value = e.target.value.trim();
    if (value.length > 0 && value !== video.title) {
      updateTitle({
        id: video._id,
        title: value,
      });
    } else setInput(video.title);
  };

  const deleteClickHandler = () => {
    let box = window.confirm('Are you sure you want to delete this project?');
    if (box === true) deleteVideo(video._id);
  };

  useEffect(() => {
    if (uploadResponse && typeof uploadResponse !== 'string') {
      video.title = uploadResponse.title;
    } else if (uploadResponse === 'error') setInput(video.title);
  }, [uploadResponse, video]);

  useEffect(() => {
    if (deleteVideoResponse === 'success') {
      setShouldFetch(true);
    }
  }, [deleteVideoResponse, setShouldFetch]);

  return (
    <div className={styles.Project}>
      <Link
        to={`/${!video.final_video_url ? 'editor' : 'preview'}/${video._id}`}
        className={styles.Video}
        style={{ backgroundImage: `url(${video.screenshot_url})` }}
      ></Link>

      <div className={styles.InfoContainer}>
        <div className={styles.Info}>
          {isUpdatingTitle ? (
            <Spinner
              style={{ width: '20px', height: '20px', margin: 'auto 0' }}
            />
          ) : (
            <input
              className={styles.Name}
              type='text'
              value={input}
              onBlur={blurHandler}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          <div className={styles.DateAndTrash}>
            <p className={styles.Date}>{transformDate(video.created_at)}</p>
            {isDeletingVideo ? (
              <Spinner
                style={{
                  width: '25.6px',
                  height: '25.6px',
                  marginLeft: '0.2rem',
                }}
              />
            ) : (
              <img
                className={styles.Trash}
                src={trash}
                alt='delete'
                onClick={deleteClickHandler}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
