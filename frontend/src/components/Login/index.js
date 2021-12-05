import { Button, Card, Form, Input, Row, Typography } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../redux/actions/user';

const Login = ({ login, loading }) => {
  const onFinish = (values) => {
    console.log('Success:', values);
    login(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div
      style={{ height: '100vh' }}
      className='d-flex justify-content-center align-items-center'
    >
      <Card className='w-75' hoverable>
        <Typography.Title level={2} className='text-center text-uppercase'>
          cont-org
        </Typography.Title>
        <Form
          name='basic'
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type='email' />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 4,
              span: 20,
            }}
          >
            <Typography.Text>
              <Link to='forgetPassword'>Forgot Password</Link>
            </Typography.Text>
            <Button
              className='float-end w-25'
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ user: { loading } }) => ({
  loading,
});
const mapDispatchToProps = { login };
export default connect(mapStateToProps, mapDispatchToProps)(Login);
