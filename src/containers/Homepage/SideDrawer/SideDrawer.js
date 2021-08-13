import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import styles from './SideDrawer.module.css';
import User from './User/User';
import templates from '../../../assets/homepage/templates.svg';
import projects from '../../../assets/homepage/projects.svg';
import settings from '../../../assets/homepage/settings.svg';

const SideDrawer = () => {
  const match = useRouteMatch();

  return (
    <div className={styles.SideDrawer}>
      <User />
      <div className={styles.Links}>
        <NavLink
          to={`${match.path}/templates`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          <img src={templates} alt='templates' />
          <span className={styles.LinkText}>Templates</span>
        </NavLink>
        <NavLink
          to={`${match.path}/projects`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          <img src={projects} alt='templates' />
          <span className={styles.LinkText}>My projects</span>
        </NavLink>
        <NavLink
          to={`${match.path}/settings`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          <img src={settings} alt='templates' />
          <span className={styles.LinkText}>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SideDrawer;
