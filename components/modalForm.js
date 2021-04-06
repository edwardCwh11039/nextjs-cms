import { Button, Form, Input, Select, message } from 'antd';
import React from 'react';
import apiServices from '../lib/services/api-services';

const ModalForm = (props) => {
  const [form] = Form.useForm();
  const { student, onFinish, countries, student_types } = props;
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
        if (student) {
          apiServices
            .editStudent({
              ...values,
              id: student.id,
            })
            .then((res) => {
              onFinish(res.data);
            });
        } else {
          apiServices.addStudent(values).then((res) => {
            onFinish(res.data);
          });
        }
      }}
      initialValues={{
        name: student?.name,
        email: student?.email,
        country: student?.country,
        type: student?.type.id,
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
          {countries.map((country) => (
            <Select.Option key={country.en} value={country.en}>
              {country.en}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="type" label="Student Type" rules={[{ required: true }]}>
        <Select>
          {Object.keys(student_types).map((key) => (
            <Select.Option key={key} value={+key} title={student_types[key]}>
              {student_types[key]}
            </Select.Option>
          ))}
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
