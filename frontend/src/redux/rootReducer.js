import { combineReducers } from 'redux';
import user from './reducers/user';
import employee from './reducers/employee';
import project from './reducers/project';
import task from './reducers/task';
import department from './reducers/department';
import team from './reducers/team';
import io from './reducers/socket';
import room from './reducers/room';

const rootReducer = combineReducers({
  user,
  employee,
  team,
  department,
  task,
  project,
  io,
  room,
});

export default rootReducer;
