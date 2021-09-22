import React from 'react';
import styles from './Projects.module.css';
import { Link } from 'react-router-dom';
import Project from './Project/Project';
import Spinner from '../../../components/Spinner2/Spinner';

const Projects = ({ videos, setShouldFetch, shouldFetch }) => {
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

        {videos ? (
          videos.map((video) => {
            return (
              <div className={styles.ProjectContainer} key={video._id}>
                <Project
                  video={video}
                  setShouldFetch={setShouldFetch}
                  shouldFetch={shouldFetch}
                />
              </div>
            );
          })
        ) : (
          <Spinner style={{ width: '60px', height: '60px' }} />
        )}
      </div>
    </div>
  );
};

export default Projects;
