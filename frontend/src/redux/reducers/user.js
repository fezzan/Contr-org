import {
  LOGIN,
  SIGNUP,
  LOGOUT,
  AUTH_LOADING,
  UPDATE,
  SET_USER,
} from '../types';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  loading: false,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN:
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    case SET_USER:
      return {
        ...state,
        ...payload,
        loading: false,
      };
    case UPDATE:
      return {
        ...state,
        user: { ...state.user, ...payload },
      };
    case SIGNUP:
      return {
        ...state,
        loading: false,
      };
    case AUTH_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { user: undefined, token: undefined, loading: false };
    default:
      return state;
  }
};

export default userReducer;
