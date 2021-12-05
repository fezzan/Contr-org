import { notification } from 'antd';
import axios from 'axios';
import {
  DELETE_TASK,
  ADD_TASK,
  GET_TASKS,
  SELECT_TASK,
  UPDATE_TASK,
} from '../types';

export const getTasks = (role) => async (dispatch) => {
  try {
    const res = await axios.get('/api/tasks/' + role);
    dispatch({
      type: GET_TASKS,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const selectTask = (selected) => ({
  type: SELECT_TASK,
  payload: { selected },
});

export const addTask = (project) => async (dispatch) => {
  try {
    const res = await axios.post('/api/tasks', project);
    const { data, message } = res.data;
    dispatch({
      type: ADD_TASK,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const updateTask = (project) => async (dispatch) => {
  try {
    const res = await axios.put('/api/tasks/' + project._id, project);
    const { data, message } = res.data;
    dispatch({
      type: UPDATE_TASK,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const deleteTask = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/tasks/' + id);
    const { message } = res.data;
    dispatch({
      type: DELETE_TASK,
      payload: id,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};
