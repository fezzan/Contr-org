import { notification } from 'antd';
import axios from 'axios';
import {
  DELETE_EMPLOYEE,
  ADD_EMPLOYEE,
  GET_EMPLOYEES,
  SELECT_EMPLOYEE,
  UPDATE_EMPLOYEE,
} from '../types';

export const getEmployees = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/users');
    dispatch({
      type: GET_EMPLOYEES,
      payload: { list: res.data },
    });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const selectEmployee = (selected) => ({
  type: SELECT_EMPLOYEE,
  payload: { selected },
});

export const addEmployee = (employee) => async (dispatch) => {
  try {
    const res = await axios.post('/api/users', employee);
    const { user, message } = res.data;

    dispatch({
      type: ADD_EMPLOYEE,
      payload: user,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const updateEmployee = (employee) => async (dispatch) => {
  try {
    const res = await axios.put(
      '/api/users/employee/' + employee._id,
      employee
    );
    const { message, user } = res.data;
    dispatch({
      type: UPDATE_EMPLOYEE,
      payload: user,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};

export const deleteEmployee = (id) => async (dispatch) => {
  try {
    const res = await axios.delete('/api/users/' + id);
    const { message } = res.data;

    dispatch({
      type: DELETE_EMPLOYEE,
      payload: id,
    });
    notification.success({ message });
  } catch (err) {
    console.log({ err });
    notification.error({ message: err?.response?.data?.message });
  }
};
