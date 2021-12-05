import { useState } from 'react';
import { Button, Card, Form, Input, notification, Typography } from 'antd';
import axios from 'axios';

const ResetPassword = ({ history: { push }, location: { pathname } }) => {
  const [loading, setLoading] = useState(false);
  const resetPassword = async ({ password }) => {
    try {
      const res = await axios.put('/api/auth/reset-password', {
        id: pathname.split('reset/')[1],
        password,
      });
      notification.success({ message: res.data.message });
      setTimeout(() => {
        push('/login');
      }, 2000);
    } catch (err) {
      console.log({ err });
      notification.error({ message: err.response.data.message });
    }
  };
  const onFinish = async (values) => {
    console.log('Success:', values);
    setLoading(true);
    await resetPassword(values);
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div
      style={{ height: '100vh' }}
      className='d-flex justify-content-center align-items-center'
    >
      <Card className='w-50' hoverable>
        <Typography.Title level={4} className='text-center'>
          Reset Password
        </Typography.Title>
        <Form
          name='reset-password'
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
            }}
          >
            <Button
              className='w-100'
              type='primary'
              htmlType='submit'
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
