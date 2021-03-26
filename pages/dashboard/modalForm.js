import { Button, Form, Input, Select, message } from 'antd';
import React from 'react';
import axios from 'axios';

const ModalForm = (props) => {
  const [form] = Form.useForm();
  const { student, onFinish } = props;
  const countries = ['China', 'New Zealand', 'Canada', 'Australia'];
  const validateMessages = {
    required: "'${name}' is required",
    types: {
      string: "'${name}' is not a valid '${type}'",
      email: "'${name}' is not a valid '${type}'",
    },
  };

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      validateMessages={validateMessages}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={(values) => {
        const storage = JSON.parse(localStorage.getItem('cms'));

        if (student) {
          axios
            .put(
              'http://localhost:3001/api/students',
              {
                ...values,
                id: student.id,
              },
              {
                headers: { Authorization: 'Bearer ' + storage.token },
              }
            )
            .then((res) => {
              message.success(res.data.msg);
              onFinish();
            })
            .catch((err) => {
              message.error(err.response.data.msg);
            });
        } else {
          axios
            .post('http://localhost:3001/api/students', values, {
              headers: { Authorization: 'Bearer ' + storage.token },
            })
            .then((res) => {
              message.success(res.data.msg);
              onFinish();
            })
            .catch((err) => {
              message.error(err.response.data.msg);
            });
        }
        onFinish();
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        country: student?.country,
        typeId: student?.type.id,
      }}
    >
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input type="text" placeholder="student name" />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input type="email" placeholder="email" />
      </Form.Item>
      <Form.Item name="country" label="Area" rules={[{ required: true }]}>
        <Select>
          {countries.map((item, index) => (
            <Select.Option value={item} key={index}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="type" label="Student Type" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={1}>Tester</Select.Option>
          <Select.Option value={2}>Developer</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        style={{
          position: 'absolute',
          bottom: '0',
          right: '7.5em',
          marginBottom: '10px',
        }}
      >
        <Button type="primary" htmlType="submit">
          {student ? 'Update' : 'Add'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ModalForm;
