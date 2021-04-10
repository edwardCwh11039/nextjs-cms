import { Table, Card, Col, Row, Tabs, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React, { useEffect, useState } from 'react';
import AppLayout from '../../../../components/layout/layout';
import apiServices from '../../../../lib/services/api-services';

export async function getServerSideProps(context) {
  const { id } = context.params;

  return { props: { id } };
}

export default function Page({ id }) {
  const [data, setData] = useState({});
  const [info, setInfo] = useState({});
  const [about, setAbout] = useState({});

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
      const { data } = res;
      const info = {
        Name: data.name,
        Age: data.age,
        Email: data.email,
        Phone: data.phone,
      };
      const about = {
        Education: data.education,
        Area: data.country,
        Gender: data.gender,
        'Member Period': data.memberStartAt + ' -' + data.memberEndAt,
        Type: data.type.name,
        'Create Time': data.createdAt,
        'Update Time': data.updatedAt,
      };

      setAbout(about);
      setInfo(info);
      setData(data);
    });
  }, []);

  return (
    <AppLayout>
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
              {Object.keys(info).map((key) => (
                <Col span={12} style={{ textAlign: 'center' }} key={info[key]}>
                  <b>{key}</b>
                  <p>{info[key]}</p>
                </Col>
              ))}
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
                  {Object.keys(about).map((key) => (
                    <Col span={24} key={about[key]}>
                      <b
                        style={{
                          marginRight: 16,
                          minWidth: 150,
                          display: 'inline-block',
                        }}
                      >
                        {key}
                      </b>
                      <span>{about[key]}</span>
                    </Col>
                  ))}
                </Row>
                <h3>Interesting</h3>
                <Row gutter={[6, 16]}>
                  <Col>
                    {data.interest?.map((item) => (
                      <Tag key={item} style={{ padding: '5px 10px' }}>
                        {item}
                      </Tag>
                    ))}
                  </Col>
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
    </AppLayout>
  );
}
