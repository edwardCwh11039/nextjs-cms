import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Badge,
  Row,
  Dropdown,
  Col,
  Breadcrumb,
  message,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  ReadOutlined,
  CalendarOutlined,
  MessageOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const DashBoard = (props) => {
  const { children } = props;
  const router = useRouter();
  const path = router.pathname;
  const [collapsed, toggleCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => toggleCollapsed(collapsed)}
      >
        //*Logo
        <div className="logo">
          <Link href="/">
            <span style={{ color: '#fff', cursor: 'pointer' }}>CMS</span>
          </Link>
        </div>
        //Todo 根据不同职位 做些调整
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<DashboardOutlined />} className="icon">
            {/* <Link href="/dashboard/overview">Overview</Link> */}
            Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<ReadOutlined />} className="icon">
            <Link href="/dashboard/studentList">Student List</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CalendarOutlined />} className="icon">
            Class Schedule
          </Menu.Item>
          <Menu.Item key="4" icon={<MessageOutlined />} className="icon">
            Message
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="styledHeader">
          <span className="icon" onClick={() => toggleCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <Row align="middle" justify="end" justify="space-between">
            <Col span={4}>
              <Badge className="icon" size="small" count={5} offset={[10, 0]}>
                <Dropdown
                  overlayStyle={{
                    background: '#fff',
                    borderRadius: 4,
                    width: 400,
                    height: 500,
                    overflow: 'hidden',
                  }}
                  placement="bottomRight"
                  trigger={['click']}
                  overlay={
                    <Menu>
                      <Menu.Item key="mail">Navigation One</Menu.Item>
                      <Menu.Item key="app">Navigation Two</Menu.Item>
                    </Menu>
                  } //! Overlay WHAT!
                >
                  <BellOutlined
                    style={{ fontSize: '24px', marginTop: '5px' }}
                  />
                </Dropdown>
              </Badge>
            </Col>
            <Col span={4}>
              {/* //? check profile? && picture */}
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      //* log out api
                      //* clear the local storage
                      //* Redirect to Login Page
                      onClick={() => {
                        const storage = JSON.parse(localStorage.getItem('cms'));
                        axios
                          .post('http://localhost:3001/api/logout', null, {
                            headers: {
                              Authorization: 'Bearer ' + storage.token,
                            },
                          })
                          .then((res) => {
                            message.success(res.msg);
                            localStorage.removeItem('cms');
                            router.push('/login');
                          })
                          .catch((err) => {
                            message.error(err.response.data.msg);
                          });
                      }}
                    >
                      <LogoutOutlined />
                      <span>Logout</span>
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomLeft"
              >
                <Avatar icon={<UserOutlined />} />
              </Dropdown>
            </Col>
          </Row>
        </Header>
        {/* //Todo 重做 */}
        <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
          <Breadcrumb.Item key={path}>
            <Link href={path}>CMS SYSTEM</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Content className="content-style">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DashBoard;
