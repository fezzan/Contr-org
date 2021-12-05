import { useState } from 'react';
import { Button, Card, Form, Input, notification, Typography } from 'antd';
import axios from 'axios';

const ForgotPassword = ({ history: { push } }) => {
  const [loading, setLoading] = useState(false);
  const forgetPassword = async ({ email }) => {
    try {
      const res = await axios.post('/api/auth/forget-password', { email });
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
    await forgetPassword(values);
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
          Forgot Password
        </Typography.Title>
        <Form
          name='forget-password'
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
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
