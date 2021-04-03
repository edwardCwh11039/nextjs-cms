import DashBoard from './index';
import { Table, Card, Col, Row, Tabs, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import apiServices from '../../lib/services/api-services';

export async function getServerSideProps(context) {
  const { id } = context.params;

  return { props: { id } };
}

export default function Page({ id }) {
  const [data, setData] = useState({});

  const columns = [
    {
      title: 'No.',
      key: 'index',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value) => <a> {value} </a>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (value) => value.map((item) => item.name).join(','),
    },
    {
      title: 'Join Time',
      dataIndex: 'createdAt',
    },
  ];

  useEffect(() => {
    apiServices.getStudentsById(id).then((res) => {
      const student = JSON.parse(JSON.stringify(res.data));
      console.log(student);
      setData(student);
    });
  }, []);

  return (
    <DashBoard>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                src={data?.avatar}
                style={{
                  width: 100,
                  height: 100,
                  display: 'block',
                  margin: 'auto',
                }}
              />
            }
          >
            <Row gutter={[6, 16]}>
              <Col span={12} style={{ textAlign: 'center' }} key={data.name}>
                <b>Name</b>
                <p>{data.name}</p>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }} key={data.age}>
                <b>Age</b>
                <p>{data.age}</p>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }} key={data.email}>
                <b>Email</b>
                <p>{data.email}</p>
              </Col>
              <Col span={12} style={{ textAlign: 'center' }} key={data.phone}>
                <b>Phone</b>
                <p>{data.phone}</p>
              </Col>
            </Row>
            <Row gutter={[6, 16]}>
              <Col span={24} style={{ textAlign: 'center' }}>
                <b>Address</b>
                <p>{data?.address}</p>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="About" key="1">
                <h3>Information</h3>
                <Row gutter={[6, 16]}>
                  <Col span={24} key={data.education}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Education
                    </b>
                    <span>{data.education}</span>
                  </Col>
                  <Col span={24} key={data.country}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Area
                    </b>
                    <span>{data.country}</span>
                  </Col>
                  <Col span={24} key={data.gender}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Gender
                    </b>
                    <span>{data.gender === 1 ? 'Male' : 'Female'}</span>
                  </Col>
                  <Col
                    span={24}
                    key={data.memberStartAt + ' -' + data.memberEndAt}
                  >
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Member Period
                    </b>
                    <span>{data.memberStartAt + ' -' + data.memberEndAt}</span>
                  </Col>
                  {/* <Col span={24} key={data.type.name}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Type
                    </b>
                    <span>{data.type.name}</span>
                  </Col> */}
                  <Col span={24} key={data.createdAt}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Create Time
                    </b>
                    <span>{data.createdAt}</span>
                  </Col>
                  <Col span={24} key={data.updatedAt}>
                    <b
                      style={{
                        marginRight: 16,
                        minWidth: 150,
                        display: 'inline-block',
                      }}
                    >
                      Update Time
                    </b>
                    <span>{data.updatedAt}</span>
                  </Col>
                </Row>
                <h3>Interesting</h3>
                <Row gutter={[6, 16]}>
                  {/* <Col>
                    {data?.interest.map((item) => (
                      <Tag key={item} style={{ padding: '5px 10px' }}>
                        {item}
                      </Tag>
                    ))}
                  </Col> */}
                </Row>
                <h3>Description</h3>
                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>{data?.description}</Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Courses" key="2">
                <Table dataSource={data.courses} columns={columns}></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </DashBoard>
  );
}
