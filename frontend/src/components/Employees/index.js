import {
  Table,
  Space,
  Card,
  Button,
  Form,
  Drawer,
  Row,
  Col,
  Input,
  Select,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { connect } from 'react-redux';
import useToggle from '../../Hooks/useToggle';
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  selectEmployee,
  updateEmployee,
} from '../../redux/actions/employee';
import { getDepartments } from '../../redux/actions/department';
const { Option } = Select;

const Employees = ({
  list,
  departs,
  getEmployees,
  selectEmployee,
  updateEmployee,
  deleteEmployee,
  addEmployee,
  getDepartments,
  selected,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      ellipsis: true,
      render: (depart) => depart?.name,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      ellipsis: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size='middle'>
          <Tooltip placement='left' title='Edit'>
            <Button
              onClick={() => {
                console.log({ record });
                selectEmployee(record);
                toggle();
              }}
              icon={<BsPencil className='text-primary' />}
            />
          </Tooltip>
          <Tooltip placement='right' title='Delete'>
            <Button
              onClick={() => deleteEmployee(record._id)}
              danger
              icon={<BsTrash className='text-danger' />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const [visible, toggle] = useToggle(false);
  const [filtered, setFiltered] = useState(undefined);

  const onSearch = (txt) => {
    if (txt) {
      setFiltered(
        list.filter((item) => {
          const regex = new RegExp(`${txt}`, 'gi');
          return (
            item.name.match(regex) ||
            item.email.match(regex) ||
            item.department?.name?.match(regex) ||
            item.role.match(regex)
          );
        })
      );
    } else {
      setFiltered(undefined);
    }
  };
  useEffect(() => {
    getEmployees();
    return () => {};
  }, []);
  return (
    <>
      <Card
        title='Employees'
        hoverable
        extra={
          <>
            <Input
              type='search'
              placeholder='Search employee'
              style={{ width: 200 }}
              allowClear
              onChange={(e) => {
                onSearch(e.currentTarget.value);
              }}
            />
            <Button onClick={toggle} type='primary' className='ms-2'>
              Add Employee
            </Button>
          </>
        }
      >
        <Table columns={columns} dataSource={filtered || list} />
      </Card>
      <EmployeeForm
        visible={visible}
        toggle={() => {
          toggle();
          selectEmployee(undefined);
        }}
        selected={selected}
        departs={departs}
        updateEmployee={updateEmployee}
        addEmployee={addEmployee}
      />
    </>
  );
};

const EmployeeForm = ({
  visible,
  toggle,
  selected,
  departs,
  updateEmployee,
  addEmployee,
}) => {
  const [loading, toggleLoading] = useToggle(false);
  const onFinish = async (values) => {
    console.log('Success:', values);
    toggleLoading();
    selected
      ? await updateEmployee({
          ...rest,
          department: department?._id,
          ...values,
        })
      : await addEmployee(values);
    toggleLoading();
    toggle();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const { department, ...rest } = selected || {};
  return (
    <Drawer
      title={selected ? 'Edit Employees' : 'Add Employees'}
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
            form='employee-form'
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
        name='employee-form'
        layout='vertical'
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ ...rest, department: department?._id }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='name'
              label='Name'
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder='Please enter name' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='email'
              label='Email'
              rules={[{ required: true, message: 'Please enter email' }]}
            >
              <Input type='email' placeholder='Please enter email' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='password'
              label='Password'
              rules={[
                {
                  required: !selected,
                  message: 'Please enter a valid password',
                  min: 6,
                },
              ]}
            >
              <Input.Password
                style={{ width: '100%' }}
                placeholder='Please enter new password'
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='department'
              label='Department'
              rules={[
                { required: true, message: 'Please select a department' },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder='Select a department'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {departs?.map(({ name, _id }) => (
                  <Option key={_id} value={_id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='role'
              label='Role'
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                allowClear
                showSearch
                placeholder='Select a role'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {[
                  'Lead',
                  'Principal',
                  'Senior',
                  'Junior',
                  'Associate',
                  'Intern',
                ].map((val) => (
                  <Option key={val} value={val}>
                    {val}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='facebook'
              label='Facebook'
              rules={[{ required: true, message: 'Please enter facebook' }]}
            >
              <Input placeholder='Please enter facebook' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='twitter'
              label='Twitter'
              rules={[{ required: true, message: 'Please enter twitter' }]}
            >
              <Input placeholder='Please enter twitter' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name='details'
              label='Detail'
              rules={[
                {
                  required: true,
                  message: 'please enter detail',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder='please enter detail' />
            </Form.Item>
          </Col>
        </Row>
       */}
      </Form>
    </Drawer>
  );
};
const mapStateToProps = ({
  employee: { list, selected },
  department: { list: departs },
}) => ({
  list,
  selected,
  departs,
});
export default connect(mapStateToProps, {
  getEmployees,
  selectEmployee,
  updateEmployee,
  deleteEmployee,
  addEmployee,
  getDepartments,
})(Employees);
