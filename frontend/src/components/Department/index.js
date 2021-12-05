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
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { connect } from 'react-redux';
import useToggle from '../../Hooks/useToggle';
import {
  addDepartment,
  deleteDepartment,
  getDepartments,
  selectDepartment,
  updateDepartment,
} from '../../redux/actions/department';

const Department = ({
  list,
  getDepartments,
  selectDepartment,
  updateDepartment,
  deleteDepartment,
  addDepartment,
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
                selectDepartment(record);
                toggle();
              }}
              icon={<BsPencil className='text-primary' />}
            />
          </Tooltip>
          <Tooltip placement='right' title='Delete'>
            <Button
              onClick={() => deleteDepartment(record._id)}
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
          return item.name.match(regex) || item.description.match(regex);
        })
      );
    } else {
      setFiltered(undefined);
    }
  };
  useEffect(() => {
    getDepartments();
    return () => {};
  }, []);
  return (
    <>
      <Card
        title='Department'
        hoverable
        extra={
          <>
            <Input
              type='search'
              placeholder='Search department'
              style={{ width: 200 }}
              allowClear
              onChange={(e) => {
                onSearch(e.currentTarget.value);
              }}
            />
            <Button onClick={toggle} type='primary' className='ms-2'>
              Add Department
            </Button>
          </>
        }
      >
        <Table columns={columns} dataSource={filtered || list} />
      </Card>
      <DepartmentForm
        visible={visible}
        toggle={() => {
          toggle();
          selectDepartment(undefined);
        }}
        selected={selected}
        updateDepartment={updateDepartment}
        addDepartment={addDepartment}
      />
    </>
  );
};

const DepartmentForm = ({
  visible,
  toggle,
  selected,
  updateDepartment,
  addDepartment,
}) => {
  const [loading, toggleLoading] = useToggle(false);
  const onFinish = async (values) => {
    console.log('Success:', values);
    toggleLoading();
    selected
      ? await updateDepartment({ ...selected, ...values })
      : await addDepartment(values);
    toggleLoading();
    toggle();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Drawer
      title={selected ? 'Edit Department' : 'Add Department'}
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
            form='department-form'
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
        name='department-form'
        layout='vertical'
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={selected}
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
          <Col span={24}>
            <Form.Item
              name='description'
              label='Description'
              rules={[
                {
                  required: true,
                  message: 'please enter description',
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder='please enter description' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
const mapStateToProps = ({ department: { list, selected } }) => ({
  list,
  selected,
});
export default connect(mapStateToProps, {
  getDepartments,
  selectDepartment,
  updateDepartment,
  deleteDepartment,
  addDepartment,
})(Department);
