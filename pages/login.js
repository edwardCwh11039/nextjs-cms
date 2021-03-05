import React from "react";
import Link from "next/link";
import { Form, Input, Button, Checkbox, Radio, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { AES } from "crypto-js";
import { useRouter } from "next/router";

const LoginForm = () => {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "80px",
        maxHeight: "100vh",
      }}
    >
      <h1
        style={{
          width: "35%",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Course Management Assistant
      </h1>
      <Form
        name="login-form"
        initialValues={{
          role: "student",
          email: "",
          password: "",
        }}
        onFinish={(values) => {
          axios
            .post("https://cms.chtoma.com/api/login", {
              ...values,
              // encrypt password
              password: AES.encrypt(values.password, "cms").toString(),
            })
            .then((res) => {
              localStorage.setItem("cms", JSON.stringify(res.data.data));
              //TODO: redirect to dashboard
              router.push("/dashboard");
            })
            .catch((err) => {
              message.error(err.response.data.msg);
            });
        }}
        style={{ width: "35%" }}
      >
        <Form.Item
          name="role"
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
              message: "Please input email",
            },
            {
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
              message: "Please input password",
            },
            {
              min: 4,
              max: 16,
              message: "Password is Invalid",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Please input password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
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
          <div>
            <span> No account? </span>
            <Link href="">Sign up</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;