import React, { useEffect, useState } from 'react';
import styles from './Homepage.module.css';
import SideDrawer from './SideDrawer/SideDrawer';
import Navbar from './Navbar/Navbar';
import Projects from './Projects/Projects';
import Templates from './Templates/Templates';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import useGetVideos from '../../hooks/useGetVideos';

const Homepage = () => {
  const match = useRouteMatch();
  const { getVideos, videos } = useGetVideos();
  const [shouldFetchVideos, setShouldFetchVideos] = useState(true);

  useEffect(() => {
    if (shouldFetchVideos) {
      setShouldFetchVideos(false);
      getVideos();
    }
  }, [getVideos, shouldFetchVideos]);

  return (
    <div className={styles.Homepage}>
      <SideDrawer />
      <div className={styles.Main}>
        <Navbar />
        <Switch>
          <Route path={`${match.path}/templates`}>
            <Templates />
          </Route>
          <Route exact path={`${match.path}/projects`}>
            <Projects
              videos={videos}
              shouldFetch={shouldFetchVideos}
              setShouldFetch={setShouldFetchVideos}
            />
          </Route>
          <Route exact path={`${match.path}/settings`}>
            <h1>Settings</h1>
          </Route>
          <Redirect to={`${match.path}/projects`} />
        </Switch>
      </div>
    </div>
  );
};

export default Homepage;
