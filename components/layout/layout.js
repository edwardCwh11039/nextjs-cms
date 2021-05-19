import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Row, Dropdown, Tabs } from 'antd';
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
import { routes } from '../../lib/constant/routes';
import { getActiveKeyPath, generateKey } from '../../lib/util/routes';

const { TabPane } = Tabs;
const { Header, Sider, Content } = Layout;

function renderMenu(role, route, parent = '') {
  return route.map((item, index) => {
    const key = generateKey(item, index);
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

const AppLayout = (props) => {
  const { children } = props;
  const [collapsed, toggleCollapsed] = useState(false);
  const router = useRouter();
  const paths = router.pathname.split('/');
  const role = storage.getRole() || paths[2];

  const roleRoute = routes[role];
  const menu = renderMenu(role, roleRoute);
  const { activePath, activeKey } = getActiveKeyPath(roleRoute);
  const keys = activeKey.split('/');
  const defaultSelectedKeys = [keys.pop()];
  const defaultOpenKeys = keys;

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
          {/* collapse toggle */}
          <span className="icon" onClick={() => toggleCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>

          <Row align="middle">
            {/* message area*/}
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
                    <Tabs>
                      <TabPane tab="Tab 1" key="1">
                        Content of Tab Pane 1
                      </TabPane>
                      <TabPane tab="Tab 2" key="2">
                        Content of Tab Pane 2
                      </TabPane>
                      <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                      </TabPane>
                    </Tabs>
                  }
                >
                  <BellOutlined
                    style={{ fontSize: '24px', marginTop: '5px' }}
                  />
                </Dropdown>
              </div>
            </Badge>

            {/* user icon - profile / logout ... */}
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

        <AppBreadCrumb activePath={activePath} roleRoute={roleRoute} />
        <Content className="content-style">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
