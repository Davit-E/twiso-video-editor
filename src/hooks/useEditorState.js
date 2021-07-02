import { useReducer } from 'react';

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case '':
      return state;

    default:
      return state;
  }
};

const useEditorState = () => {
  const [editorState, editorDispatch] = useReducer(reducer, initialState);
  return [editorState, editorDispatch];
};

export default useEditorState;
