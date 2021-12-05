import { notification } from 'antd';
import axios from 'axios';
import {
  DELETE_PROJECT,
  ADD_PROJECT,
  GET_PROJECTS,
  SELECT_PROJECT,
  UPDATE_PROJECT,
} from '../types';

export const getProjects = (role) => async (dispatch) => {
  try {
    const res = await axios.get('/api/projects/' + role);
    dispatch({
      type: GET_PROJECTS,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const selectProject = (selected) => ({
  type: SELECT_PROJECT,
  payload: { selected },
});

export const addProject = (project) => async (dispatch) => {
  try {
    const res = await axios.post('/api/projects', project);
    const { data, message } = res.data;
    dispatch({
      type: ADD_PROJECT,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const updateProject = (project) => async (dispatch) => {
  try {
    const res = await axios.put('/api/projects/' + project._id, project);
    const { data, message } = res.data;
    dispatch({
      type: UPDATE_PROJECT,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const deleteProject = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/projects/' + id);
    const { message } = res.data;
    dispatch({
      type: DELETE_PROJECT,
      payload: id,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};
