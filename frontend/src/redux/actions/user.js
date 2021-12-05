import { notification } from 'antd';
import axios from 'axios';
import {
  AUTH_LOADING,
  LOGIN,
  LOGOUT,
  SET_USER,
  SIGNUP,
  UPDATE,
} from '../types';

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING, payload: true });
    const res = await axios.post('/api/auth', data);
    dispatch({
      type: LOGIN,
      payload: { token: res.data.token, user: res.data.user },
    });
  } catch (err) {
    dispatch({ type: AUTH_LOADING, payload: false });
    notification.error({ message: err?.response?.data?.message });
    console.log(err);
  }
};

export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: SET_USER,
      payload: { user: res.data },
    });
  } catch (err) {
    notification.error({ message: err?.response?.data?.message });
    console.log(err);
  }
};

export const update = (data) => async (dispatch) => {
  try {
    const res = await axios.put('/api/users', data);
    const { message, user } = res.data;
    dispatch({
      type: UPDATE,
      payload: user,
    });
    notification.success({ message });
  } catch (err) {
    notification.error({ message: err?.response?.data?.message });
    console.log(err);
  }
};

export const signup = (data) => async (dispatch) => {
  try {
    dispatch({ type: AUTH_LOADING, payload: true });
    const res = await axios.post('/api/users', data);
    dispatch({ type: SIGNUP });
    notification.success({ message: res.data?.message });
  } catch (err) {
    dispatch({ type: AUTH_LOADING, payload: false });
    console.log(err);
    notification.error({ message: err?.response?.data?.message });
  }
};

export const logout = () => ({ type: LOGOUT });
