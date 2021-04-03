import React, { useState } from 'react';
import { Layout, Menu, Badge, Row, Dropdown, Breadcrumb } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiServices from '../../lib/services/api-services';

const { Header, Sider, Content } = Layout;

const DashBoard = (props) => {
  const { children } = props;
  const router = useRouter();
  const path = router.pathname;
  const [collapsed, toggleCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => toggleCollapsed(collapsed)}
      >
        <div className="logo">
          <Link href="/">
            <span style={{ color: '#fff', cursor: 'pointer' }}>CMS</span>
          </Link>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="2" icon={<ReadOutlined />} className="icon">
            <Link href="/dashboard/studentList">Student List</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="styledHeader">
          <span className="icon" onClick={() => toggleCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <Row align="middle">
            <Badge size="small" count={5} offset={[10, 0]}>
              <div className="icon">
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
                </Dropdown>{' '}
              </div>
            </Badge>
            <div className="icon" style={{ marginLeft: '2em' }}>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      //* log out api
                      //* clear the local storage
                      //* Redirect to Login Page
                      onClick={() => {
                        apiServices.logout().then((res) => {
                          localStorage.removeItem('cms');
                          router.push('/login');
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
            </div>
          </Row>
        </Header>

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
