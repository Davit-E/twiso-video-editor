import React from 'react';
import styles from './Project.module.css';

const Project = ({color, name, date}) => {
  return (
    <div style={{background: color}} className={styles.Project}>
      <div className={styles.Info}>
        <p className={styles.Name}>{name}</p>
        <p className={styles.Date}>{date}</p>
      </div>
    </div>
  );
};

export default Project;