import './App.css';
import VideoEditor from './containers/VideoEditor/VideoEditor';
import AppContext from './contexts/AppContext';
import useAppState from './hooks/useAppState';

const App = () => {
  const [appState, appDispatch] = useAppState();
  return (
    <div className='App'>
      <AppContext.Provider value={{ appState, appDispatch }}>
        <VideoEditor />
      </AppContext.Provider>
    </div>
  );
};

export default App;
