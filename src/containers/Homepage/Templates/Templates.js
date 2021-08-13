import React from 'react';
import styles from './Templates.module.css';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  NavLink,
} from 'react-router-dom';
import Webinar from './Webinar/Webinar';

const Templates = () => {
  const match = useRouteMatch();
  return (
    <div className={styles.Templates}>
      <div className={styles.NavLinks}>
        <NavLink
          to={`${match.path}/webinar`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Webinar
        </NavLink>
        <NavLink
          to={`${match.path}/podcast`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Podcast
        </NavLink>
        <NavLink
          to={`${match.path}/vlog`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Vlog
        </NavLink>
        <NavLink
          to={`${match.path}/demo-recording`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Demo recording
        </NavLink>
        <NavLink
          to={`${match.path}/video-testimonial`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Video testimonial
        </NavLink>
        <NavLink
          to={`${match.path}/training-onboarding`}
          className={styles.Link}
          activeClassName={styles.Active}
          replace
        >
          Training & onboarding
        </NavLink>
      </div>

      <Switch>
        <Route exact path={`${match.path}/webinar`}>
          <Webinar />
        </Route>
        <Route exact path={`${match.path}/podcast`}>
          <h1>Podcast</h1>
        </Route>
        <Route exact path={`${match.path}/vlog`}>
          <h1>Vlog</h1>
        </Route>
        <Route exact path={`${match.path}/demo-recording`}>
          <h1>Demo recording</h1>
        </Route>
        <Route exact path={`${match.path}/video-testimonial`}>
          <h1>Video testimonial</h1>
        </Route>
        <Route exact path={`${match.path}/training-onboarding`}>
          <h1>Training & onboarding</h1>
        </Route>
        <Redirect to={`${match.path}/webinar`} />
      </Switch>
    </div>
  );
};

export default Templates;
