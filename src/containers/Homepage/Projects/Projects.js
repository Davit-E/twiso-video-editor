import React from 'react';
import styles from './Projects.module.css';
import { Link } from 'react-router-dom';
import Project from './Project/Project';
const Projects = () => {
  return (
    <div className={styles.Projects}>
      <h2 className={styles.Heading}>My projects</h2>
      <p className={styles.Subheading}>
        All your video and audio files in one place.
      </p>
      <div className={styles.ProjectsList}>
        <Link className={styles.AddProject} to='/editor/new'>
          <span>+ Add new</span>
        </Link>
        <Project color='#eabd4b' name='Name' date='12.02.2021' />
        <Project color='#6F7BD0' name='Name' date='12.02.2021' />
        <Project color='#DF7C6E' name='Name' date='12.02.2021' />
        <Project color='#eabd4b' name='Name' date='12.02.2021' />
      </div>
    </div>
  );
};

export default Projects;
