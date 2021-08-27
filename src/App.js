import React from 'react';
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
fabricConfig();

const App = () => {
  const [userState, userDispatch] = useUserState();

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
