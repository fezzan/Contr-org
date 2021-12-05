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
  addTeam,
  deleteTeam,
  getTeams,
  selectTeam,
  updateTeam,
} from '../../redux/actions/team';
import { getDepartments } from '../../redux/actions/department';
import axios from 'axios';
const { Option } = Select;

const Team = ({
  list,
  getTeams,
  selectTeam,
  updateTeam,
  deleteTeam,
  addTeam,
  getDepartments,
  selected,
  departs,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: ({ name }) => name,
    },
    {
      title: 'Description',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: ({ description }) => description,
    },
    {
      title: 'Department',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: true,
      render: ({ department }) => department.name,
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
                selectTeam(record);
                toggle();
              }}
              icon={<BsPencil className='text-primary' />}
            />
          </Tooltip>
          <Tooltip placement='right' title='Delete'>
            <Button
              onClick={() => deleteTeam(record._id)}
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
            item.detail.name.match(regex) ||
            item.detail.description.match(regex)
          );
        })
      );
    } else {
      setFiltered(undefined);
    }
  };
  useEffect(() => {
    getTeams();
    getDepartments();
    return () => {};
  }, []);
  return (
    <>
      <Card
        title='Team'
        hoverable
        extra={
          <>
            <Input
              type='search'
              placeholder='Search team'
              style={{ width: 200 }}
              allowClear
              onChange={(e) => {
                onSearch(e.currentTarget.value);
              }}
            />
            <Button onClick={toggle} type='primary' className='ms-2'>
              Add Team
            </Button>
          </>
        }
      >
        <Table columns={columns} dataSource={filtered || list} />
      </Card>
      <TeamForm
        visible={visible}
        toggle={() => {
          toggle();
          selectTeam(undefined);
        }}
        selected={selected}
        updateTeam={updateTeam}
        addTeam={addTeam}
        departs={departs}
      />
    </>
  );
};

const TeamForm = ({
  visible,
  toggle,
  selected,
  updateTeam,
  addTeam,
  departs,
}) => {
  const [loading, toggleLoading] = useToggle(false);
  const onFinish = async (values) => {
    console.log('Success:', values);
    toggleLoading();
    selected
      ? await updateTeam({
          ...detail,
          department: detail?.department._id,
          ...rest,
          ...values,
        })
      : await addTeam(values);
    toggleLoading();
    toggle();
    setLeads([]);
    setNonLeads([]);
  };

  const [leads, setLeads] = useState([]);
  const [nonLeads, setNonLeads] = useState([]);

  const getLeads = async (id) => {
    try {
      const res = await axios.get('/api/users/leads/department/' + id);
      if (selected) {
        setLeads(res.data);
      } else {
        setLeads(res.data.filter((val) => val.team === null));
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const getNonLeads = async (id) => {
    try {
      const res = await axios.get('/api/users/members/department/' + id);
      if (selected) {
        setNonLeads(res.data);
      } else {
        setNonLeads(res.data.filter((val) => val.team === null));
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (selected) {
      getLeads(selected.detail.department._id);
      getNonLeads(selected.detail.department._id);
    }
    console.log({ selected, leads, nonLeads });
    return () => {};
  }, [selected]);
  const { detail, ...rest } = selected || {};
  return (
    <Drawer
      title={selected ? 'Edit Team' : 'Add Team'}
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
            form='team-form'
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
        name='team-form'
        layout='vertical'
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          ...detail,
          department: detail?.department?._id,
          ...rest,
        }}
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
            <Form.Item
              name='department'
              label='Department'
              rules={[
                { required: true, message: 'Please select a department' },
              ]}
            >
              <Select
                onChange={(val) => {
                  if (!val) {
                    setLeads([]);
                    setNonLeads([]);
                  } else {
                    getLeads(val);
                    getNonLeads(val);
                  }
                }}
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
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='lead'
              label='Lead'
              rules={[{ required: true, message: 'Please select a lead' }]}
            >
              <Select
                allowClear
                showSearch
                placeholder='Select a lead'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {leads?.map(({ name, _id }) => (
                  <Option key={_id} value={_id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='list'
              label='Members'
              rules={[{ required: true, message: 'Please select members' }]}
            >
              <Select
                mode='tags'
                allowClear
                showSearch
                placeholder='Select members'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {nonLeads?.map(({ name, _id }) => (
                  <Option key={_id} value={_id}>
                    {name}
                  </Option>
                ))}
              </Select>
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
const mapStateToProps = ({
  team: { list, selected },
  department: { list: departs },
}) => ({
  list,
  selected,
  departs,
});
export default connect(mapStateToProps, {
  getTeams,
  selectTeam,
  updateTeam,
  deleteTeam,
  addTeam,
  getDepartments,
})(Team);
