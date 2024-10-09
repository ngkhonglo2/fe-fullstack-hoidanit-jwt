"use client";

import { sendRequest } from "@/utils/api";
import {
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

interface IModalReactive {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  email: string;
}

const ModalReactive = ({
  isModalOpen,
  setIsModalOpen,
  email,
}: IModalReactive) => {
  const [current, setCurrent] = useState(0);
  const [userId, setUserId] = useState("");

  const onFinishStepZero = async (value: any) => {
    const { email } = value;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      body: {
        email,
      },
    });
    if (res?.data) {
      setUserId(res?.data?._id);
      setCurrent(1);
    } else {
      notification.error({
        message: "Call api error",
        description: res.message,
      });
    }
  };

  const onFinishStepOne = async (value: any) => {
    const { code } = value;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      body: {
        _id: userId,
        code,
      },
    });
    if (res?.data) {
      setCurrent(2);
    } else {
      notification.error({
        message: "Call api error",
        description: res.message,
      });
    }
  };

  return (
    <Modal
      title="Kích hoạt tài khoản"
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      maskClosable={false}
      footer={null}
    >
      <Steps
        current={current}
        items={[
          {
            title: "Login",
            icon: <UserOutlined />,
          },
          {
            title: "Verification",
            icon: <SolutionOutlined />,
          },
          {
            title: "Done",
            icon: <SmileOutlined />,
          },
        ]}
      />
      {current === 0 && (
        <>
          <div style={{ margin: "20px 0" }}>Tài khoản chưa được kích hoạt</div>
          <Form
            name="verify"
            onFinish={onFinishStepZero}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item label="" name="email" initialValue={email}>
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Resend
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {current === 1 && (
        <>
          <div style={{ margin: "20px 0" }}>Vui lòng nhập mã xác nhận</div>
          <Form
            name="verify2"
            onFinish={onFinishStepOne}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please input your code!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Active
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
      {current === 2 && (
        <>
          <div>
            Tài khoản của bạn đã kích hoạt thành công vui lòng đăng nhập lại
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalReactive;
