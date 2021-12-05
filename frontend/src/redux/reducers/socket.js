import { UPDATE_SOCKET, LOGOUT } from '../types';

const initialState = {
  activeUsers: {},
  socket: undefined,
};

const socketReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE_SOCKET:
      return {
        ...state,
        ...payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default socketReducer;
