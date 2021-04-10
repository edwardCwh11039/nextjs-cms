import { HeartFilled, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import Link from 'next/link';
import React from 'react';
import { useEffect } from 'react';

const DurationUnit = ['year', 'month', 'day', 'week', 'hour'];

const getDuration = (data) => {
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;

  return duration > 1 ? text + 's' : text;
};

export default function CourseOverview(props) {
  return (
    <Card cover={<img src={props.cover} style={{ height: 260 }} />}>
      <Row gutter={[6, 16]}>
        <h3>{props.name}</h3>
      </Row>

      <Row
        className="courseRow"
        gutter={[6, 16]}
        justify="space-between"
        align="middle"
      >
        <Col>{props.startTime}</Col>
        <Col style={{ display: 'flex', alignItems: 'center' }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: 'red' }} />
          <b>{props.star}</b>
        </Col>
      </Row>

      <Row className="courseRow" gutter={[6, 16]} justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{getDuration(props)}</b>
        </Col>
      </Row>

      <Row className="courseRow" gutter={[6, 16]} justify="space-between">
        <Col>Teacher:</Col>
        <Col style={{ fontWeight: 'bold' }}>
          {props?.teacherName && (
            <Link href="/dashboard/manager">{props.teacherName}</Link>
          )}
        </Col>
      </Row>

      <Row gutter={[6, 16]} justify="space-between">
        <Col>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }}
          />
          <span>Student Limit:</span>
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>
      
      {props.children}
    </Card>
  );
}
