import React, { useEffect, useMemo, useState } from 'react';
import styles from './ResizeDropdown.module.css';

const ResizeDropdown = ({ state, dispatch }) => {
  const [current, setCurrent] = useState(null);
  const sizes = useMemo(
    () => ({
      original: { width: 526, height: 741, zoom: 1 },
      slide: { width: 1920, height: 1080, zoom: 0.5 },
      a4: { width: 2480, height: 3508, zoom: 0.2 },
      facebook: { width: 940, height: 788, zoom: 0.75 },
      linkedin: { width: 1128, height: 191, zoom: 0.9 },
      video: { width: 1280, height: 720, zoom: 0.8 },
    }),
    []
  );
   
  let options = [
    { content: 'Original', id: 'original' },
    { content: 'Slide 16:9', id: 'slide' },
    { content: 'A4', id: 'a4' },
    { content: 'Facebook post', id: 'facebook' },
    { content: 'Linkedin cover', id: 'linkedin' },
    { content: 'Video thumbnail', id: 'video' },
  ];

  const clickHandler = (e) => {
    if (e.target.classList.contains(styles.SizeOption)) {
      dispatch({
        type: 'setCanvasSize',
        data: { ...sizes[e.target.id] },
      });
      dispatch({ type: 'setIsResizeDropdown', data: false });
    }
  };

  useEffect(() => {
    for (let [key, value] of Object.entries(sizes)) {
      if (value.width === state.width && value.height === state.height) {
        setCurrent(key);
      }
    }
  }, [sizes, state]);

  return (
    <div className={styles.Dropdown}>
      <ul className={styles.SizeOptions} onClick={clickHandler}>
        {options.map((el) => {
          return (
            <li
              key={el.id}
              id={el.id}
              className={[
                styles.SizeOption,
                current && el.id === current ? styles.Current : null,
              ].join(' ')}
            >
              {el.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ResizeDropdown;
