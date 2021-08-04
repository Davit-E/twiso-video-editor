import './App.css';
import VideoEditor from './containers/VideoEditor/VideoEditor';
import EditorContext from './contexts/EditorContext';
import useEditorState from './hooks/useEditorState';

const App = () => {
  const [editorState, editorDispatch] = useEditorState();
  console.log(editorState);
  return (
    <div className='App'>
      <EditorContext.Provider value={{ editorState, editorDispatch }}>
        <VideoEditor />
      </EditorContext.Provider>
    </div>
  );
};

export default App;
