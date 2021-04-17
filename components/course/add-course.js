import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { format, getTime } from 'date-fns';
import storage from '../../lib/services/storage';
import apiServices from '../../lib/services/api-services';
import { duration_unit } from '../../lib/constant/durationUnit';
import TextArea from 'antd/lib/input/TextArea';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function AddCourse() {
  const [form] = useForm();
  const [teachers, setTeachers] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [number, setNumber] = useState(0);
  const [unit, setUnit] = useState(duration_unit[2]);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({});

  const onFinish = (values) => {
    const data = {
      ...values,
      duration: number,
      startTime: values.startTime.format('yyyy-MM-DD'),
      teacherId: +values.teacherId,
      durationUnit: Number(unit),
    };
    console.log(values);
    console.log(data);
  };

  useEffect(() => {
    apiServices.getCoursesCode().then((res) => {
      const { data } = res;

      form.setFieldsValue({ uid: data });
    });

    apiServices.getCoursesType().then((res) => {
      const { data } = res;

      setCourseTypes(data);
    });
  }, []);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={[6, 16]}>
        <Col span={6}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>{' '}
        <Col span={6}>
          <Form.Item
            label="Teacher"
            name="teacherId"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select teacher"
              showSearch
              filterOption={false}
              onSearch={(value) => {
                if (value && value !== 'a') {
                  apiServices.getTeachers(value).then((res) => {
                    const { teachers } = res.data;

                    if (teachers.length > 0) {
                      setTeachers(teachers);
                    }
                  });
                }
              }}
            >
              {teachers.map(({ id, name }) => {
                return (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>{' '}
        <Col span={6}>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select mode="multiple">
              {courseTypes.map((value) => {
                return (
                  <Select.Option key={value.id} value={value.id}>
                    {value.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>{' '}
        <Col span={6}>
          <Form.Item
            label="Course Code"
            name="uid"
            rules={[{ required: true }]}
          >
            <Input type="text" placeholder="course code" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => {
                const today = getTime(new Date());
                const date = current.valueOf();

                return date < today;
              }}
            />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <InputNumber min={0} style={{ width: '100%' }}></InputNumber>
          </Form.Item>
          <Form.Item label="Student Limit" name="maxStudents">
            <InputNumber min={0} style={{ width: '100%' }}></InputNumber>
          </Form.Item>
          <Form.Item label="Duration" name="duration">
            <Input.Group compact style={{ display: 'flex' }}>
              <InputNumber
                value={number}
                onChange={(value) => {
                  setNumber(value);
                }}
                style={{ flex: 1 }}
              />
              <Select
                value={unit}
                onChange={(value) => {
                  setUnit(value);
                }}
              >
                {Object.keys(duration_unit).map((key) => {
                  return (
                    <Select.Option value={key} key={key}>
                      {duration_unit[key]}
                    </Select.Option>
                  );
                })}
              </Select>
            </Input.Group>
          </Form.Item>
        </Col>

        <Col span={8} style={{ position: 'relative' }}>
          <Form.Item
            className="descriptionTextArea"
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                min: 100,
                max: 1000,
                message:
                  'Description length must between 100 - 1000 characters.',
              },
            ]}
          >
            <TextArea
              placeholder="Course description"
              style={{ height: '100%' }}
            />
          </Form.Item>
        </Col>

        <Col span={8} style={{ position: 'relative' }}>
          <Form.Item className="uploadArea" label="Cover" name="cover">
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
              onPreview={async (file) => {
                console.log(file);
                if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
                }
                setPreview({
                  previewImage: file.url || file.preview,
                  previewTitle:
                    file.name ||
                    file.url.substring(file.url.lastIndexOf('/') + 1),
                });
              }}
              onChange={({ fileList, file }) => {
                if (file?.response) {
                  const { url } = file.response;
                  form.setFieldsValue({ cover: url });
                } else {
                  form.setFieldsValue({ cover: '' });
                }
                setFileList(fileList);
              }}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Course
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
