import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Pagination } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const Overview = () => {
  const [data, setData] = useState([]);

  const countries = ['China', 'New Zealand', 'Canada', 'Australia'];
  const student_types = ['developer', 'tester'];

  var page = 1;
  var limit = 20;

  const fetchData = (inputPage, inputLimit) => {
    page = inputPage;
    limit = inputLimit;
    const storage = JSON.parse(localStorage.getItem('cms'));
    axios
      .get(`http://localhost:3001/api/students?page=${page}&limit=${limit}`, {
        headers: { Authorization: 'Bearer ' + storage.token },
      })
      .then((res) => {
        const converted_response = JSON.parse(JSON.stringify(res.data.data));
        setData(converted_response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData(page, limit);
  }, []);

  const dataSource = data.students;

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
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          defaultCurrent: page,
          pageSize: limit,
          total: data.total,
        }}
        onChange={(pagination, filters, sorter) => {
          console.log(pagination);
          console.log(filters);
          console.log(sorter);
          fetchData(pagination.current, pagination.pageSize);
        }}
      />
      ;
    </div>
  );
};
export default Overview;
