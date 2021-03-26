import React, { useState, useEffect } from 'react';
import { Table, Space, Input, message, Button, Modal, Popconfirm } from 'antd';
import TextLink from 'antd/lib/typography/Link';
import { AudioOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import { debounce } from 'lodash';
import DashBoard from './index';
import StudentForm from './studentForm';

const { Search } = Input;

const studentList = () => {
  const [data, setData] = useState([]);
  const [paginator, setPaginator] = useState({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  //filtering
  const countries = ['China', 'New Zealand', 'Canada', 'Australia'];
  const student_types = ['developer', 'tester'];

  const fetchData = () => {
    const { page, limit } = paginator;
    const storage = JSON.parse(localStorage.getItem('cms'));
    axios
      .get(
        `http://localhost:3001/api/students?query=${query}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: 'Bearer ' + storage.token },
        }
      )
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data.data));
        setTotal(data.total);
        setData(data.students);
      })
      .catch((err) => {
        message.error(err.response.data.msg);
      });
  };

  useEffect(() => {
    fetchData();
  }, [paginator, query]);

  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sortDirections: ['ascend', 'descend'],
      sorter: (pre, next) => {
        return pre.name[0] > next.name[0]
          ? 1
          : pre.name[0] === next.name[0]
          ? 0
          : -1;
      },
      render: (text) => <a>{text}</a>, //Todo: link path
    },
    {
      title: 'Area',
      dataIndex: 'country',
      width: '10%',
      filters: countries.map((country) => ({ text: country, value: country })),
      onFilter: (value, record) => record.country.includes(value),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      width: '25%',
      render: (courses) => courses?.map((course) => course.name).join(','),
    },
    {
      title: 'Student Type',
      dataIndex: 'type',
      filters: student_types.map((type) => ({ text: type, value: type })),
      onFilter: (value, record) => record.type.name === value,
      render: (type) => type?.name,
    },
    {
      title: 'Join Time',
      dataIndex: 'createdAt',
      render: (time) =>
        formatDistanceToNow(new Date(time), { addSuffix: true }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record, index) => (
        <Space size="middle">
          <TextLink
            onClick={() => {
              setEditStudent(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </TextLink>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              const storage = JSON.parse(localStorage.getItem('cms'));
              axios
                .delete(`http://localhost:3001/api/students/${record.id}`, {
                  headers: { Authorization: 'Bearer ' + storage.token },
                })
                .then((res) => {
                  if (res.data.data) {
                    const index = data.findIndex(
                      (item) => item.id === record.id
                    );
                    const updatedData = [...data];
                    updatedData.splice(index, 1);
                    setData(updatedData);
                    setTotal(total - 1);
                  }
                });
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const updateQuery = debounce(setQuery, 1000);

  const cancel = () => {
    setIsModalVisible(false);
    setEditStudent(null);
  };

  return (
    <DashBoard>
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setEditStudent(null);
          }}
        >
          Add
        </Button>
        <Search
          placeholder="Search by name"
          onSearch={(value) => setQuery(value)}
          onChange={(event) => updateQuery(event.target.value)}
        />
      </Space>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          ...paginator,
          total,
        }}
        onChange={(pagination) => {
          setPaginator((prevState) => ({
            ...prevState,
            page: pagination.current,
            limit: pagination.pageSize,
          }));
        }}
      />
      <Modal
        title={editStudent ? 'Edit Student' : 'Add Student'}
        destroyOnClose={true}
        maskClosable={false}
        centered
        visible={isModalVisible}
        onCancel={cancel}
        footer={[
          <Button key="cancel" onClick={cancel}>
            Cancel
          </Button>,
        ]}
      >
        <StudentForm
          student={editStudent}
          onFinish={(student) => {
            console.log(student);
            setIsModalVisible(false);
          }}
        ></StudentForm>
      </Modal>
    </DashBoard>
  );
};
export default studentList;
