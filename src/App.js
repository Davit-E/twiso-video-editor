import React, { useEffect } from 'react';
import './App.css';
import Editor from './containers/Editor/Editor';
import Auth from './containers/Auth/Auth';
import Homepage from './containers/Homepage/Homepage';
import UserContext from './contexts/UserContext';
import useUserState from './hooks/useUserState';
import fabricConfig from './fabricConfig';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import CustomRoute from './components/CustomRoute/CustomRoute';
import useTrackTime from './hooks/useTrackTime';
import useRefreshToken from './hooks/useRefreshToken';
import setAuthToken from './utils/setAuthToken';
import Preview from './containers/Preview/Preview';

fabricConfig();
const App = () => {
  const [userState, userDispatch] = useUserState();
  const { refreshToken, newToken, refreshError } = useRefreshToken();
  useTrackTime(refreshToken);
  useEffect(() => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setAuthToken(newToken);
    } else if (refreshError) {
      localStorage.removeItem('token');
      userDispatch({ type: 'setIsAuthenticated', data: false });
    }
  }, [newToken, refreshError, userDispatch]);

  return (
    <div className='App'>
      <UserContext.Provider value={{ userState, userDispatch }}>
        <Router basename='/'>
          <Switch>
            <CustomRoute
              path='/auth'
              redirect='/home'
              where='in the App auth route'
              allowed={!userState.isAuthenticated}
              component={Auth}
            />
            <CustomRoute
              path='/home'
              redirect='/auth'
              where='in the App home route'
              allowed={userState.isAuthenticated}
              component={Homepage}
            />
            <CustomRoute
              path='/editor'
              redirect='/auth'
              where='in the App editor route'
              allowed={userState.isAuthenticated}
              component={Editor}
            />
            <CustomRoute
              path='/preview/:id'
              redirect='/auth'
              where='in the App preview route'
              allowed={userState.isAuthenticated}
              component={Preview}
            />
            <Route path='/'>
              {userState.isAuthenticated ? (
                <Redirect to='/home' />
              ) : (
                <Redirect to='/auth' />
              )}
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </div>
  );
};

export default App;
