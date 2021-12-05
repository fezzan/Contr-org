import {
  AiOutlinePieChart,
  AiOutlineFolder,
  AiOutlineUser,
  AiOutlineBlock,
  AiOutlineTeam,
  AiOutlineFile,
  AiOutlineWechat,
} from 'react-icons/ai';
import Chat from './components/Chat';
import Department from './components/Department';
import Employees from './components/Employees';
import Project from './components/Project';
import Report from './components/Report';
import Task from './components/Task';
import TaskGraph from './components/TaskGraph';
import Team from './components/Team';

export const nav = [
  {
    name: 'Departments',
    route: '/departments',
    Icon: AiOutlineBlock,
    roles: ['admin'],
    component: Department,
  },
  {
    name: 'Employees',
    route: '/employees',
    Icon: AiOutlineUser,
    roles: ['admin'],
    component: Employees,
  },
  {
    name: 'Teams',
    route: '/teams',
    Icon: AiOutlineTeam,
    roles: ['admin'],
    component: Team,
  },
  {
    name: 'Projects',
    route: '/projects',
    Icon: AiOutlineFolder,
    roles: ['admin', 'Lead'],
    component: Project,
  },
  {
    name: 'Tasks',
    route: '/tasks',
    Icon: AiOutlineFile,
    roles: ['Lead', 'Principal', 'Senior', 'Junior', 'Associate', 'Intern'],
    component: Task,
  },
  {
    name: 'Graphs',
    route: '/graphs',
    Icon: AiOutlinePieChart,
    roles: ['admin'],
    component: Report,
  },
  {
    name: 'Graphs',
    route: '/graphs',
    Icon: AiOutlinePieChart,
    roles: ['Lead'],
    component: TaskGraph,
  },
  {
    name: 'Chat',
    route: '/chat',
    Icon: AiOutlineWechat,
    roles: [
      'admin',
      'Lead',
      'Principal',
      'Senior',
      'Junior',
      'Associate',
      'Intern',
    ],
    component: Chat,
  },
];
