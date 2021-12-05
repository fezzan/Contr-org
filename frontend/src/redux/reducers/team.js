import {
  DELETE_TEAM,
  ADD_TEAM,
  GET_TEAMS,
  LOGOUT,
  SELECT_TEAM,
  UPDATE_TEAM,
} from '../types';

const initialState = {
  list: [],
  selected: undefined,
};

const teamReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_TEAMS:
    case SELECT_TEAM:
      return {
        ...state,
        ...payload,
      };
    case ADD_TEAM:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case UPDATE_TEAM:
      return {
        ...state,
        list: state.list.map((val) =>
          val._id === payload._id ? payload : val
        ),
      };
    case DELETE_TEAM:
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

export default teamReducer;
