import { useReducer } from 'react';

const initialState = {
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'setIsAuthenticated':
      return { ...state, isAuthenticated: action.data };

    default:
      return state;
  }
};

const useUserState = () => {
  const [userState, userDispatch] = useReducer(reducer, initialState);
  return [userState, userDispatch];
};

export default useUserState;
