import { ADD_ROOM, LOGOUT, SET_ROOM, SET_ROOMS } from '../types';

const initialState = {
  list: [],
  room: undefined,
};

const roomReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ROOM:
    case SET_ROOMS:
      return {
        ...state,
        ...payload,
      };
    case ADD_ROOM:
      return {
        ...state,
        list: [...state.list, payload],
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default roomReducer;
