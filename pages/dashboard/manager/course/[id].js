import { Badge, Card, Col, Collapse, Row, Steps, Tag } from 'antd';
import Table from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../../components/layout/layout';
import apiServices from '../../../../lib/services/api-services';
import CourseOverview from '../../../../components/course/overview';

const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const CourseStatusText = ['finised', 'processing', 'pending'];
const CourseStatusBadge = ['warning', 'seccess', 'default'];
const CourseStatusColor = ['default', 'green', 'orange'];

export async function getServerSideProps(context) {
  const { id } = context.params;

  return { props: { id } };
}

export const getChapterExtra = (source, index) => {
  const activeIndex = source.chapters.findIndex(
    (item) => item.id === source.current
  );
  const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;

  return (
    <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
  );
};

export default function Page({ id }) {
  const [info, setInfo] = useState({});
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [data, setData] = useState(null);

  const columns = weekDays.map((day) => {
    const target =
      data?.schedule.classTime.find((time) =>
        time.toLocaleLowerCase().includes(day.toLocaleLowerCase())
      ) || '';
    const time = target.split(' ')[1];
    return { title: day, key: day, render: () => time };
  });

  useEffect(() => {
    apiServices.getCoursesById(id).then((res) => {
      const { data } = res;
      const sales = data.sales;
      const info = {
        Price: sales.price,
        Batches: sales.batches,
        Students: sales.studentAmount,
        Earings: sales.earnings,
      };
      setInfo(info);
      setActiveChapterIndex(
        data.schedule.chapters.findIndex(
          (item) => item.id === data.schedule.current
        )
      );
      setData(data);
    });
  }, []);

  return (
    <AppLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseOverview {...data}>
            <Row
              className="courseDetailRow"
              gutter={[6, 16]}
              justify="space-between"
              align="middle"
            >
              {Object.entries(info).forEach(([key, value]) => (
                <Col className="courseDetailCol" span="6" key={value}>
                  <b>{value}</b>
                  <p>{key}</p>
                </Col>
              ))}
            </Row>
          </CourseOverview>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <h2 style={{ color: '#7356f1' }}>Course Detail</h2>

            <h3 style={{ margin: '1em 0' }}>Create Time</h3>
            <Row>{data?.createdAt}</Row>

            <h3 style={{ margin: '1em 0' }}>Start Time</h3>
            <Row>{data?.startTime}</Row>

            <Badge status={CourseStatusBadge[data?.status]} offset={[5, 24]}>
              <h3 style={{ margin: '1em 0' }}>Status</h3>
            </Badge>
            <Row className="courseStepsRow">
              <Steps
                size="small"
                current={activeChapterIndex}
                style={{ width: 'auto' }}
              >
                {data?.schedule.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </Row>

            <h3 style={{ margin: '1em 0' }}>Course Code</h3>
            <Row>{data?.uid}</Row>

            <h3 style={{ margin: '1em 0' }}>Class Time</h3>
            {!data?.schedule.classTime ? (
              <></>
            ) : (
              <Table
                rowKey="id"
                bordered
                size="small"
                pagination={false}
                columns={columns}
                dataSource={data?.schedule.classTime}
              ></Table>
            )}

            <h3 style={{ margin: '1em 0' }}>Category</h3>
            <Row>
              {data?.type.map((item) => (
                <Tag color={'geekblue'} key={item.id}>
                  {item.name}
                </Tag>
              ))}
            </Row>

            <h3 style={{ margin: '1em 0' }}>Description</h3>
            {data?.detail !== 'no' ? <Row>{data?.detail}</Row> : <Row></Row>}

            <h3 style={{ margin: '1em 0' }}>Chapter</h3>
            {data?.schedule && (
              <Collapse defaultActiveKey={data.schedule.current}>
                {data.schedule.chapters.map((item, index) => (
                  <Collapse.Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(data.schedule, index)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}
