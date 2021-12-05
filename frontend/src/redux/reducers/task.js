import {
  DELETE_TASK,
  ADD_TASK,
  GET_TASKS,
  LOGOUT,
  SELECT_TASK,
  UPDATE_TASK,
} from '../types';

const initialState = {
  list: [],
  selected: undefined,
};

const taskReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_TASKS:
    case SELECT_TASK:
      return {
        ...state,
        ...payload,
      };
    case ADD_TASK:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case UPDATE_TASK:
      return {
        ...state,
        list: state.list.map((val) =>
          val._id === payload._id ? payload : val
        ),
      };
    case DELETE_TASK:
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

export default taskReducer;
