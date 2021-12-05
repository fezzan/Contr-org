import { notification } from 'antd';
import axios from 'axios';
import {
  DELETE_TEAM,
  ADD_TEAM,
  GET_TEAMS,
  SELECT_TEAM,
  UPDATE_TEAM,
} from '../types';

export const getTeams = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/teams');
    dispatch({
      type: GET_TEAMS,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const selectTeam = (selected) => ({
  type: SELECT_TEAM,
  payload: { selected },
});

export const addTeam = (team) => async (dispatch) => {
  try {
    const res = await axios.post('/api/teams', team);
    const { data, message } = res.data;

    dispatch({
      type: ADD_TEAM,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const updateTeam = (team) => async (dispatch) => {
  try {
    const res = await axios.put('/api/teams/' + team._id, team);
    const { message, data } = res.data;
    dispatch({
      type: UPDATE_TEAM,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const deleteTeam = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/teams/' + id);
    const { message } = res.data;

    dispatch({
      type: DELETE_TEAM,
      payload: id,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};
