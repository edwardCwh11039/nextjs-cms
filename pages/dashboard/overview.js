import React, { useState, useEffect } from 'react';
import { Table, Space, Input, message } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

const Overview = () => {
  const [data, setData] = useState([]);
  const [paginator, setPaginator] = useState({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState(`page=${paginator.page}&limit=${paginator.limit}`);

  const countries = ['China', 'New Zealand', 'Canada', 'Australia'];
  const student_types = ['developer', 'tester'];

  const fetchData = () => {
    const storage = JSON.parse(localStorage.getItem('cms'));
    axios
      .get(`http://localhost:3001/api/students?${query}`, {
        headers: { Authorization: 'Bearer ' + storage.token },
      })
      .then((res) => {
        const data = JSON.parse(JSON.stringify(res.data.data));
        setTotal(data.total);
        setData(data.students);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const dataSource = data;

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
      render: (text) => <a>{text}</a>,
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
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical">
        <Search
          placeholder="Search by name"
          onSearch={(value) =>
            value
              ? setQuery(
                  `query=${value}&page=${paginator.page}&limit=${paginator.limit}`
                )
              : message.error('Empty input!')
          }
          enterButton
        />
      </Space>
      <Table
        dataSource={dataSource}
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
          setQuery(`page=${paginator.page}&limit=${paginator.limit}`);
        }}
      />
      ;
    </div>
  );
};
export default Overview;
