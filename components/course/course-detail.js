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
  message,
  Spin,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useForm } from 'antd/lib/form/Form';
import ImgCrop from 'antd-img-crop';
import { getTime } from 'date-fns';
import moment from 'moment';
import apiServices from '../../lib/services/api-services';
import { duration_unit } from '../../lib/constant/durationUnit';
import NumberWithUnit from '../common/number-with-unit';
import TextArea from 'antd/lib/input/TextArea';
import { CloseCircleOutlined, InboxOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function CourseDetailForm({ course, onFinish }) {
  const [form] = useForm();
  const [teachers, setTeachers] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [isAdd, setIsAdd] = useState(course === undefined);
  const [isSearching, setIsSearching] = useState(false);

  const handleFinish = (values) => {
    if (!isAdd && !course) {
      message.error('You must select a course to update!');
      return;
    }
    const req = {
      ...values,
      duration: values.duration.number,
      startTime: values.startTime.format('yyyy-MM-DD'),
      teacherId: +values.teacherId || +course.teacherId,
      durationUnit: +values.duration.unit,
    };
    const res = isAdd
      ? apiServices.addCourse(req)
      : apiServices.updateCourses({ ...req, id: course.id });
    const { data } = res;

    if (!!data && !course) {
      setIsAdd(false);
    }
    if (!!onFinish && !!data) {
      onFinish(data);
    }
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

  useEffect(() => {
    if (!!course) {
      const values = {
        ...course,
        type: course.type.map((item) => item.id),
        teacherId: course.teacherName,
        startTime: moment(course.startTime),
        duration: { number: course.duration, unit: course.durationUnit },
      };

      form.setFieldsValue(values);
      setFileList([{ name: 'Cover Image', url: course.cover }]);
    }
  }, [course]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Form.Item
              label="Course Name"
              name="name"
              rules={[{ required: true }, { max: 100, min: 3 }]}
            >
              <Input type="text" placeholder="course name" />
            </Form.Item>
          </Col>{' '}
          <Col span={16}>
            <Row gutter={[6, 16]}>
              <Col span={8}>
                <Form.Item
                  label="Teacher"
                  name="teacherId"
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select teacher"
                    notFoundContent={isSearching ? <Spin size="small" /> : null}
                    showSearch
                    filterOption={false}
                    onSearch={(value) => {
                      setIsSearching(true);
                      apiServices.getTeachers(value).then((res) => {
                        const { teachers } = res.data;

                        if (teachers.length > 0) {
                          setTeachers(teachers);
                        }
                        setIsSearching(false);
                      });
                    }}
                  >
                    {teachers.map(({ id, name }) => (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <Select mode="multiple">
                    {courseTypes.map((value) => (
                      <Select.Option key={value.id} value={value.id}>
                        {value.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Course Code"
                  name="uid"
                  rules={[{ required: true }]}
                >
                  <Input type="text" placeholder="course code" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={[6, 16]}>
          <Col
            span={8}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'space-between',
            }}
          >
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
              <InputNumber
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                style={{ width: '100%' }}
              ></InputNumber>
            </Form.Item>

            <Form.Item label="Student Limit" name="maxStudents">
              <InputNumber min={0} style={{ width: '100%' }}></InputNumber>
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              style={{ marginBottom: '0' }}
            >
              <NumberWithUnit options={duration_unit} defaultUnit={2} />
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
              <ImgCrop rotate aspect={16 / 9}>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={async (file) => {
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
                      form.setFieldsValue({ cover: file.response.url });
                    } else {
                      form.setFieldsValue({ cover: course?.cover || '' });
                    }
                    setIsUploading(file.status === 'uploading');
                    setFileList(fileList);
                  }}
                >
                  {fileList.length >= 1 ? null : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{ fontSize: '48px', color: '#1890ff' }}
                        />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
            {isUploading && (
              <CloseCircleOutlined
                onClick={() => {
                  setIsUploading(false);
                  setFileList([]);
                }}
                style={{
                  color: 'red',
                  position: 'absolute',
                  right: '-10px',
                  top: '1em',
                  fontSize: '24px',
                  opacity: '0.5',
                }}
              />
            )}
          </Col>
        </Row>

        <Row gutter={[6, 16]}>
          <Col span={8}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isUploading}>
                {isAdd ? 'Create Course' : 'Update Course'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Modal
        visible={!!preview}
        title={preview?.previewTitle}
        footer={null}
        onCancel={() => setPreview(null)}
      >
        <img
          alt="example"
          style={{ width: '100%' }}
          src={preview?.previewImage}
        />
      </Modal>
    </>
  );
}
