import { notification } from 'antd';
import { ADD_ROOM, SET_ROOM, SET_ROOMS } from '../types';
import axios from 'axios';

export const getRooms = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/room');
    dispatch({
      type: SET_ROOMS,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const setRoom = (room) => ({
  type: SET_ROOM,
  payload: { room },
});

export const addRoom = (room) => ({
  type: ADD_ROOM,
  payload: room,
});
