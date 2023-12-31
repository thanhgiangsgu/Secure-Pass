import React from "react";
import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import Warehouse from "./Warehouse";
import Message from "./Message";
import AuditLog from "./AuditLog";
import TwoFa from "./TwoFa";
import "./Account.css";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState("1"); // Mặc định chọn item 1
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = (itemKey) => {
    setSelectedItem(itemKey);
  };

  return (
    <>
      <Layout className="account">
        <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Password Record",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Message",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "Lịch sử thao tác",
              },
            ]}
            selectedKeys={[selectedItem]} // Đặt selectedKeys bằng trạng thái selectedItem
            onClick={({ key }) => handleMenuClick(key)} // Xử lý sự kiện khi một item được click
            style={{ fontSize: "20px" }} // Thay đổi font size cho tất cả item
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content className="content">
            {selectedItem === "1" && <Warehouse />}
            {selectedItem === "2" && <Message />}
            {selectedItem === "3" && <AuditLog />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
