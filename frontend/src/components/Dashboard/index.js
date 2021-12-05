import {
  Avatar,
  Button,
  Col,
  Drawer,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Tooltip,
  Typography,
  Form,
  notification,
} from 'antd';
import './style.css';
import {
  AiOutlineMenuUnfold,
  AiOutlineMenuFold,
  AiOutlineUser,
} from 'react-icons/ai';
import useToggle from '../../Hooks/useToggle';
import TextTransition, { presets } from 'react-text-transition';
import { Route, Redirect, Link } from 'react-router-dom';
import { logout, update } from '../../redux/actions/user';
import { updateSocket } from '../../redux/actions/socket';
import { getRooms, setRoom, addRoom } from '../../redux/actions/room';
import { connect } from 'react-redux';
import { useEffect, useRef } from 'react';
import { nav } from '../../routes';
import { io } from 'socket.io-client';

let socket;
const { Text } = Typography;
const { Header, Sider, Content } = Layout;

const Dashboard = ({
  location,
  logout,
  update,
  updateSocket,
  getRooms,
  setRoom,
  addRoom,
  name,
  email,
  role,
  room,
  rooms,
  _id,
}) => {
  const [collapsed, toggle] = useToggle(false);
  const [drawer, toggleDrawer] = useToggle(false);

  const dropdown = useRef({ logout: logout, profile: toggleDrawer }).current;
  const selectedKeys = useRef([]).current;

  useEffect(() => {
    selectedKeys.push(location.pathname);
    return () => {};
  }, [location.pathname, selectedKeys]);

  useEffect(() => {
    socket = io('http://localhost:5000', { path: '/socket' });
    updateSocket({ socket });

    socket.emit('active_user', _id);

    socket.on('active_users', (activeUsers) => updateSocket({ activeUsers }));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on('receive_message', (data) => {
      console.log({ data, room });
      // if (room?.room?._id !== data?.room?._id) {
      notification.success({
        message: data?.room?.members?.find(({ _id: id }) => _id !== id)?.name,
        description: data?.message,
      });
      // }
    });

    socket?.on(_id, (room) => {
      console.log({ room });
      socket.emit('join_room', room._id);
      // if (!rooms?.find(({ _id }) => room?._id === _id)) addRoom(room);
      setTimeout(() => {
        getRooms();
      }, 500);
    });
    return () => {};
  }, []);

  return (
    <Layout id='components-layout-demo-custom-trigger'>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
        breakpoint='lg'
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <TextTransition
          className='logo'
          style={{ marginLeft: collapsed ? 35 : 60 }}
          text={
            collapsed ? role?.charAt(0)?.toUpperCase() : role?.toUpperCase()
          }
          springConfig={presets.stiff}
        />
        <Menu theme='dark' mode='inline' defaultSelectedKeys={selectedKeys}>
          {nav.map(({ name, route, Icon, roles }) =>
            roles.includes('all') || roles.includes(role) ? (
              <Menu.Item key={route} icon={<Icon />}>
                <Link className='text-decoration-none' to={route}>
                  {name}
                </Link>
              </Menu.Item>
            ) : null
          )}
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header
          className='site-layout-background d-flex align-items-center justify-content-between'
          style={{ padding: 0, position: 'sticky', top: 0, zIndex: 99 }}
        >
          {collapsed ? (
            <AiOutlineMenuUnfold
              size={28}
              style={{ marginLeft: 20, cursor: 'pointer' }}
              onClick={toggle}
            />
          ) : (
            <AiOutlineMenuFold
              size={28}
              style={{ marginLeft: 20, cursor: 'pointer' }}
              onClick={toggle}
            />
          )}
          <div className='d-flex justify-content-between align-items-center'>
            <Tooltip placement='bottomRight' title={email}>
              <Text className='me-2' strong>
                {name}
              </Text>
            </Tooltip>
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    dropdown[key]();
                  }}
                >
                  <Menu.Item key='profile' className='text-center width-100'>
                    Profile
                  </Menu.Item>
                  <Menu.Item
                    key='logout'
                    className='text-center text-danger width-100'
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
              placement='bottomRight'
              arrow
            >
              <Avatar
                size='large'
                className='dark-color pointer me-3'
                icon={<AiOutlineUser className='align-self-center mb-2' />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          className='site-layout-background'
          style={{
            minHeight: 280,
            overflow: 'initial',
          }}
        >
          <div
            className='site-layout-background'
            style={{ padding: 14, textAlign: 'center' }}
          >
            {nav.map(({ route, component, roles }) =>
              roles.includes('all') || roles.includes(role) ? (
                <Route key={route} exact component={component} path={route} />
              ) : null
            )}
            <Route path='/' exact>
              <Redirect
                to={
                  role === 'admin'
                    ? '/departments'
                    : role === 'Lead'
                    ? '/projects'
                    : '/tasks'
                }
              />
            </Route>
          </div>
        </Content>
      </Layout>
      <UserForm
        visible={drawer}
        toggle={toggleDrawer}
        selected={{ name, _id }}
        update={update}
      />
    </Layout>
  );
};

const UserForm = ({ visible, toggle, selected, update }) => {
  const [loading, toggleLoading] = useToggle(false);
  const onFinish = async (values) => {
    console.log('Success:', values);
    toggleLoading();
    await update({ ...selected, ...values });
    toggleLoading();
    toggle();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Drawer
      title='Edit Profile'
      width={720}
      onClose={toggle}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      destroyOnClose={true}
      footer={
        <Space className='float-end'>
          <Button disabled={loading} onClick={toggle}>
            Cancel
          </Button>
          <Button
            htmlType='submit'
            form='user-form'
            key='submit'
            type='primary'
            loading={loading}
          >
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        name='user-form'
        layout='vertical'
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={selected}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='name'
              label='Name'
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder='Please enter name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='password' label='New Password'>
              <Input.Password
                style={{ width: '100%' }}
                placeholder='Please enter new password'
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

const mapStateToProps = ({
  user: { user: { name, email, _id, role = 'Admin' } = {} },
  room: { room, list: rooms },
}) => ({
  name,
  email,
  _id,
  role,
  room,
  rooms,
});

export default connect(mapStateToProps, {
  logout,
  update,
  updateSocket,
  getRooms,
  setRoom,
  addRoom,
})(Dashboard);
