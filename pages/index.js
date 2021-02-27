import React from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { Form, Input, Button, Checkbox, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const LoginForm = () => {
  return (
    <div
      style={{
        margin: "auto",
        width: "33%",
      }}
    >
      <h1
        style={{
          margin: "25px 0px",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Course Management Assistant
      </h1>
      <Form
        name="login-form"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={(values) => {
          console.log("success:", values);
        }}
      >
        <Form.Item
          name="role"
          initialValue="student"
          button="solid"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group>
            <Radio.Button value="student">Student</Radio.Button>
            <Radio.Button value="teacher">Teacher</Radio.Button>
            <Radio.Button value="manager">Manager</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Please input email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              min: 4,
              max: 16,
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Please input password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%", margin: "25px 0px" }}
          >
            Sign In
          </Button>
          <span> No account? </span>
          <Link href="">Sign up</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
