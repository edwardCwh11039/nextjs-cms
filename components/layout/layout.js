import React, { useState, useEffect } from 'react';
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
import { Routes } from '../../lib/constant/routes';

const { Header, Sider, Content } = Layout;

function renderMenu(role, route, parent = '') {
  return route.map((item) => {
    const key = `${item.label}_${item.path}`;
    if (item.subNav && !!item.subNav.length) {
      return (
        <SubMenu key={key} icon={item.icon} title={item.label}>
          {renderMenu(role, item.subNav, `${item.path}`)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} icon={item.icon} className="icon">
          <Link
            href={['/dashboard', role, parent, item.path]
              .filter((item) => item !== '')
              .join('/')}
          >
            {item.label}
          </Link>
        </Menu.Item>
      );
    }
  });
}

function deepSearchRecordFactory(predicateFn, value, key) {
  return function search(data, record = []) {
    const headNode = data.slice(0, 1)[0];
    const restNode = data.slice(1);

    record.push(`${headNode.label}_${headNode.path}`);
    if (predicateFn(headNode, value)) {
      const hasIndexPage = headNode[key]?.find((item) => item.path === '');
      const result = hasIndexPage
        ? record.push(`${hasIndexPage.label}_${hasIndexPage.path}`)
        : record;
      return result;
    }

    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop();
      }
    }

    if (restNode.length) {
      record.pop();

      const res = search(restNode, record);

      if (res) {
        return record;
      }
    }
    return null;
  };
}

const fn = (data, value) => data.path === value;

function menuConfig(route, value) {
  const deepSearchRecordFn = deepSearchRecordFactory(fn, value, 'subNav');
  const record = deepSearchRecordFn(route);
  const defaultOpenKeys = record.slice(0, -1);
  const defaultSelectedKeys = record.pop();

  return { defaultOpenKeys, defaultSelectedKeys };
}

const AppLayout = (props) => {
  const { children } = props;
  const [collapsed, toggleCollapsed] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split('/');
  const role = storage.getRole() || paths[2];

  const roleRoute = Routes[role];
  const menu = renderMenu(role, roleRoute);

  const { defaultOpenKeys, defaultSelectedKeys } = menuConfig(
    roleRoute,
    paths.length === 3 ? '' : paths[paths.length - 1]
  );

  useEffect(() => {
    console.log(defaultOpenKeys, defaultSelectedKeys);
  }, []);

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
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menu}
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

        <AppBreadCrumb />
        <Content className="content-style">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
