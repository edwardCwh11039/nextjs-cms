import React, { useState } from "react";
import {
  Layout,
  Menu,
  Badge,
  Row,
  Dropdown,
  Tabs,
  Col,
  Breadcrumb,
} from "antd";
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
} from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { useRouter } from "next/router";
import Link from "next/link";

const { Header, Sider, Content } = Layout;

const DashBoard = () => {
  const router = useRouter();
  const path = router.pathname;
  const [collapsed, toggleCollapsed] = useState(false);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed) => toggleCollapsed(collapsed)}
      >
          //Todo: LOGO
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />} className="icon">
            Overview
          </Menu.Item>
          <Menu.Item key="2" icon={<ReadOutlined />} className="icon">
            Course
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
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "icon",
              onClick: () => toggleCollapsed(!collapsed),
            }
          )}
          <Row align="middle" justify="end" justify="space-between">
            <Col span={4}>
              <Badge className="icon" size="small" count={5} offset={[10, 0]}>
                  //Todo: overlay need more data
                <Dropdown
                  overlayStyle={{
                    background: "#fff",
                    borderRadius: 4,
                    width: 400,
                    height: 500,
                    overflow: "hidden",
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                  overlay={<Tabs></Tabs>}
                >
                  <BellOutlined style={{ fontSize: "24px", marginTop: "5" }} />
                </Dropdown>
              </Badge>
            </Col>
            <Col span={4}>
                //Todo: check profile? && picture
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                    //* Erase data from local storage
                    //* Redirect to Login Page / others
                      onClick={() => {
                        localStorage.removeItem("cms");
                        router.push("/login");
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
        <Breadcrumb style={{ margin: "0 16px", padding: 16 }}>
          <Breadcrumb.Item key={path}>
            <Link href={path}>CMS SYSTEM</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        //Todo: how to swap the content when I select another from Sider
        <Content></Content>
      </Layout>
    </Layout>
  );
};

export default DashBoard;