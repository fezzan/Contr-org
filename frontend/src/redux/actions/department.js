import { notification } from 'antd';
import axios from 'axios';
import {
  DELETE_DEPARTMENT,
  ADD_DEPARTMENT,
  GET_DEPARTMENTS,
  SELECT_DEPARTMENT,
  UPDATE_DEPARTMENT,
} from '../types';

export const getDepartments = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/departments');
    dispatch({
      type: GET_DEPARTMENTS,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const selectDepartment = (selected) => ({
  type: SELECT_DEPARTMENT,
  payload: { selected },
});

export const addDepartment = (department) => async (dispatch) => {
  try {
    const res = await axios.post('/api/departments', department);
    const { data, message } = res.data;

    dispatch({
      type: ADD_DEPARTMENT,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const updateDepartment = (department) => async (dispatch) => {
  try {
    const res = await axios.put(
      '/api/departments/' + department._id,
      department
    );
    const { message, data } = res.data;
    dispatch({
      type: UPDATE_DEPARTMENT,
      payload: data,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const deleteDepartment = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/departments/' + id);
    const { message } = res.data;

    dispatch({
      type: DELETE_DEPARTMENT,
      payload: id,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};
