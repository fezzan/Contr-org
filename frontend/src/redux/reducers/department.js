import {
  DELETE_DEPARTMENT,
  ADD_DEPARTMENT,
  GET_DEPARTMENTS,
  LOGOUT,
  SELECT_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from '../types';

const initialState = {
  list: [],
  selected: undefined,
};

const departmentReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_DEPARTMENTS:
    case SELECT_DEPARTMENT:
      return {
        ...state,
        ...payload,
      };
    case ADD_DEPARTMENT:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case UPDATE_DEPARTMENT:
      return {
        ...state,
        list: state.list.map((val) =>
          val._id === payload._id ? payload : val
        ),
      };
    case DELETE_DEPARTMENT:
      console.log(state.list[0]._id, payload);
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

export default departmentReducer;
