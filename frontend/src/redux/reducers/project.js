import {
  DELETE_PROJECT,
  ADD_PROJECT,
  GET_PROJECTS,
  LOGOUT,
  SELECT_PROJECT,
  UPDATE_PROJECT,
} from '../types';

const initialState = {
  list: [],
  selected: undefined,
};

const projectReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_PROJECTS:
    case SELECT_PROJECT:
      return {
        ...state,
        ...payload,
      };
    case ADD_PROJECT:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case UPDATE_PROJECT:
      return {
        ...state,
        list: state.list.map((val) =>
          val._id === payload._id ? payload : val
        ),
      };
    case DELETE_PROJECT:
      return {
        ...state,
        list: state.list.filter((val) => val._id !== payload),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default projectReducer;
