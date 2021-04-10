import React, { useState } from 'react';
import { Layout, Menu, Badge, Row, Dropdown } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';

import apiServices from '../../lib/services/api-services';
import storage from '../../lib/services/storage';
import AppBreadCrumb from './breadcrumb';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Header, Sider, Content } = Layout;

const AppLayout = (props) => {
  const { children } = props;
  const [collapsed, toggleCollapsed] = useState(false);
  const router = useRouter();
  const role = storage.getRole();

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => toggleCollapsed(collapsed)}
      >
        <div className="logo">
          <Link href={`/dashboard/${role}`}>
            <span style={{ color: '#fff', cursor: 'pointer' }}>CMS</span>
          </Link>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<ReadOutlined />} className="icon">
            <Link href={`/dashboard/${role}`}>Home</Link>
          </Menu.Item>
          <SubMenu key="student" icon={<ReadOutlined />} title="Student">
            <Menu.Item key="2" icon={<ReadOutlined />} className="icon">
              <Link href={`/dashboard/${role}/student`}>Student List</Link>
            </Menu.Item>
          </SubMenu>

          {role == 'manager' && (
            <SubMenu key="course" icon={<ReadOutlined />} title="Course">
              <Menu.Item key="4" icon={<ReadOutlined />} className="icon">
                <Link href={`/dashboard/${role}/course`}>All Courses</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<ReadOutlined />} className="icon">
                <Link href={`/dashboard/${role}/course/add-course`}>Add Courses</Link>
              </Menu.Item>
              <Menu.Item key="6" icon={<ReadOutlined />} className="icon">
                <Link href={`/dashboard/${role}/course/edit-course`}>
                  Edit Courses
                </Link>
              </Menu.Item>
            </SubMenu>
          )}
        </Menu>
      </Sider>
      <Layout id="contentLayout">
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
                        apiServices.logout().then(() => {
                          storage.deleteStorage();
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

        {/* <AppBreadCrumb></AppBreadCrumb> */}
        <Content className="content-style">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
