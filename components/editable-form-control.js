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
          initialValues={{ username: username }}
          onFinish={(value) => {
            console.log(value.username);
            setUsername(value.username);
            setIsEditing(false);
          }}
        >
          <Form.Item
            label="Username"
            name="username"
            className="editable_form_control"
          >
            <Input />
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div onDoubleClick={() => setIsEditing(true)}>{username}</div>
      )}
    </>
  );
}
