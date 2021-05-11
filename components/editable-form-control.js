import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { useState } from 'react';

export default function EditableFormControl(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('testing'); //from props
  return (
    <>
      {isEditing ? (
        <Form
          name="basic"
          initialValues={props.initialValues}
          onFinish={(value) => {
            console.log(value.username);
            setUsername(value.username);
            setIsEditing(false);
          }}
        >
          <div className="editable_form_control">
            <Form.Item label={props.label} name={props.name}>
              {props.children}
            </Form.Item>
            <Button onClick={() => setIsEditing(false)}>
              <CloseOutlined />
            </Button>
            <Button type="primary" htmlType="submit">
              <CheckOutlined />
            </Button>
          </div>
        </Form>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)}>{username}</div>
      )}
    </>
  );
}
