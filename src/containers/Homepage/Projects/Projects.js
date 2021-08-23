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
        <div className={styles.AddProject}>
          <Link className={styles.AddProjectInner} to='/editor/new'>
            <div className={styles.AddProjectText}>
              <span>+ Add new</span>
            </div>
          </Link>
        </div>
        <div className={styles.ProjectContainer}>
          <Project color='#eabd4b' name='Name' date='12.02.2021' />
        </div>
        <div className={styles.ProjectContainer}>
          <Project color='#6F7BD0' name='Name' date='12.02.2021' />
        </div>
        <div className={styles.ProjectContainer}>
          <Project color='#DF7C6E' name='Name' date='12.02.2021' />
        </div>
        <div className={styles.ProjectContainer}>
          <Project color='#eabd4b' name='Name' date='12.02.2021' />
        </div>
      </div>
    </div>
  );
};

export default Projects;
