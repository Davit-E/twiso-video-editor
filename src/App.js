import React, { useState } from 'react';
import './App.css';
import VideoEditor from './containers/VideoEditor/VideoEditor';
import EditorContext from './contexts/EditorContext';
import useEditorState from './hooks/useEditorState';
import Auth from './containers/Auth/Auth';
const App = () => {
  const [editorState, editorDispatch] = useEditorState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // console.log(editorState);
  return (
    <div className='App'>
      {isAuthenticated ? (
        <EditorContext.Provider value={{ editorState, editorDispatch }}>
          <VideoEditor />
        </EditorContext.Provider>
      ) : (
        <Auth
          setIsAuthenticated={setIsAuthenticated}
          isSent={isSent}
          setIsSent={setIsSent}
        />
      )}
    </div>
  );
};

export default App;
