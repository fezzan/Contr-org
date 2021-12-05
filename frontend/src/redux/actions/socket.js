import { UPDATE_SOCKET } from '../types';

export const updateSocket = (payload) => ({
  type: UPDATE_SOCKET,
  payload,
});
