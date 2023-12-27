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
import MyAccount from "./MyAccount";
import ChangePass from "./ChangePass";
import TwoFa from "./TwoFa";
import "./Account.css";
const { Header, Sider, Content } = Layout;

const Account = () => {
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
                label: "Account Information",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "Security",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "2FA",
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
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 600,
              background: colorBgContainer,
            }}
          >
            {selectedItem === "1" && <MyAccount />}
            {selectedItem === "2" && <ChangePass />}
            {selectedItem === "3" && <TwoFa />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Account;
