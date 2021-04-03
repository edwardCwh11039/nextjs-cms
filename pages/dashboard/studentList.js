import React, { useState, useEffect, useCallback } from 'react';
import { Table, Space, Input, Button, Modal, Popconfirm } from 'antd';
import TextLink from 'antd/lib/typography/Link';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { debounce } from 'lodash';
import DashBoard from './index';
import ModalForm from '../../components/modalForm';
import { student_types } from '../../lib/constant/config';
import apiServices from '../../lib/services/api-services';

const { Search } = Input;

export async function getStaticProps() {
  const countries = await apiServices.getCountries().then((res) => {
    const data = JSON.parse(JSON.stringify(res.data));
    return data;
  });

  return { props: { countries } };
}

const studentList = ({ countries }) => {
  const [data, setData] = useState([]);
  const [paginator, setPaginator] = useState({
    page: 1,
    limit: 20,
  });
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const fetchData = () => {
    const { page, limit } = paginator;
    apiServices.getStudents(query, page, limit).then((res) => {
      const data = JSON.parse(JSON.stringify(res.data));
      const students = data.students.map((student) => ({
        ...student,
        key: student.id,
      }));

      setTotal(data.total);
      setData(students);
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
        pre = pre.name.charCodeAt(0);
        next = next.name.charCodeAt(0);

        return pre > next ? 1 : pre === next ? 0 : -1;
      },
      render: (_, record) => (
        <Link href={`/dashboard/${record.id}`}>{record.name}</Link>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'country',
      width: '10%',
      filters: countries.map((country) => ({
        text: country.en,
        value: country.en,
      })),
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
      filters: Object.keys(student_types).map((key) => ({
        text: student_types[key],
        value: key,
      })),
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
      render: (_, record) => (
        <Space size="middle">
          <TextLink
            onClick={() => {
              setEditStudent(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </TextLink>
          {/* //* 删除student //* 同时更新图表 */}
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              apiServices.deleteStudents(record.id).then((res) => {
                if (res.data) {
                  const index = data.findIndex((item) => item.id === record.id);
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

  const updateQuery = useCallback(debounce(setQuery, 1000), []);

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
          total,
          current: paginator.page,
          pageSize: paginator.limit,
          showSizeChanger: true,
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
        <ModalForm
          student={editStudent}
          onFinish={(student) => {
            console.log(student, editStudent);
            if (editStudent) {
              const index = data.findIndex((item) => item.id === student.id);

              data[index] = student;
              setData([...data]);
            }
            setIsModalVisible(false);
          }}
          countries={countries}
          student_types={student_types}
        ></ModalForm>
      </Modal>
    </DashBoard>
  );
};
export default studentList;
