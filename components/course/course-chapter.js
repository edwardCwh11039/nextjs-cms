import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, message, Row, Col, TimePicker, Button, Select } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import { Option } from 'antd/lib/mentions';
import React, { useState, useEffect } from 'react';
import { weekDays } from '../../lib/constant/config';
import apiServices from '../../lib/services/api-services';

export default function CourseChapterForm({ courseId, scheduleId, onFinish }) {
  const [form] = useForm();
  const [selectedDays, setSelectedDays] = useState([]);
  const initialValues = {
    chapters: [{ name: '', content: '' }],
    classTime: [{ day: '', time: '' }],
  };
  const updateSelectedDays = (namePath = []) => {
    const selected = form.getFieldValue('classTime') || [];
    let result = selected.map((item) => item?.weekday);

    if (namePath) {
      const value = form.getFieldValue(namePath);

      result = result.filter((item) => item !== value);
    }

    setSelectedDays(result);
  };
  const handleFinish = (values) => {
    const req = {
      chapters: values.chapters.map((item, index) => ({
        ...item,
        order: index + 1,
      })),
      classTime: values.classTime.map(
        ({ weekday, time }) => `${weekday} ${time.format('hh:mm:ss')}`
      ),
      scheduleId,
      courseId,
    };
    apiServices.updateSchedule(req).then((res) => {
      const { data } = res;

      if (data) {
        onFinish();
      }
    });
  };

  useEffect(() => {
    if (scheduleId != null) {
      return;
    }

    apiServices.getScheduleById(scheduleId).then((res) => {
      const { data } = res;
      if (!!data) {
        const classTimes = data.classTime.map((item) => {
          const [weekday, time] = item.split(' ');

          return { weekday, time: new Date(`2020-11-11 ${time}`) };
        });

        form.setFieldsValue({ chapters: data.chapters, classTime: classTimes });
        setSelectedDays(classTimes.map((item) => item.weekday));
      }
    });
  }, [scheduleId]);

  return (
    <Form
      name="schedule"
      autoComplete="off"
      form={form}
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Row gutter={[6, 16]}>
        <Col span={12}>
          <h2>Chapters</h2>
          <Form.List name="chapters">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        fieldKey={[field.fieldKey, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter Name" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        fieldKey={[field.fieldKey, 'content']}
                        rules={[{ required: true }]}
                      >
                        <Input size="large" placeholder="Chapter content" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(field.name);
                            } else {
                              message.warn(
                                'You must set at least one chapter.'
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>

        <Col span={12}>
          <h2>Class times</h2>
          <Form.List name="classTime">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={20}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'weekday']}
                        fieldKey={[field.fieldKey, 'weekday']}
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          onChange={(value) =>
                            setSelectedDays([...selectedDays, value])
                          }
                        >
                          {weekDays.map((day) => (
                            <Option
                              key={day}
                              value={day}
                              disabled={selectedDays.includes(day)}
                            >
                              {day}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'time']}
                        fieldKey={[field.fieldKey, 'time']}
                        rules={[{ required: true }]}
                      >
                        <TimePicker size="large" />
                      </Form.Item>
                    </Col>

                    <Col span={2}>
                      <Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              updateSelectedDays([
                                'classTime',
                                field.name,
                                'weekday',
                              ]);
                              remove(field.name);
                            } else {
                              message.warn(
                                'You must set at least one class time.'
                              );
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ))}

                <Row>
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        size="large"
                        disabled={fields.length >= 7}
                        onClick={() => {
                          updateSelectedDays();
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Class Time
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
