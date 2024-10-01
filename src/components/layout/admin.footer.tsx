'use client'

import { Layout } from "antd";

const { Footer } = Layout;

const AdminFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      PhongNT ©{new Date().getFullYear()} Created by Ant UED
    </Footer>
  );
};

export default AdminFooter;
