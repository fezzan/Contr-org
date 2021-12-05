import {
  DELETE_EMPLOYEE,
  ADD_EMPLOYEE,
  GET_EMPLOYEES,
  LOGOUT,
  SELECT_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from '../types';

const initialState = {
  list: [],
  selected: undefined,
};

const employeeReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_EMPLOYEES:
    case SELECT_EMPLOYEE:
      return {
        ...state,
        ...payload,
      };
    case ADD_EMPLOYEE:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        list: state.list.map((val) =>
          val._id === payload._id ? payload : val
        ),
      };
    case DELETE_EMPLOYEE:
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

export default employeeReducer;
