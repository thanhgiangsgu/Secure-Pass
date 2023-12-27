import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "./Navbar.css";
import axios from "axios";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

const Navbar = ({ tokenEnabled }) => {
  const [show, setShow] = useState(false);
  const [lastName, setLastName] = useState("Login");
  const [isHovered, setIsHovered] = useState(false);

  const Listbox = ["information", "Logout"];

  const handleLogout = () => {
    // Xóa thông tin từ localStorage
    localStorage.removeItem("user_id");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Tải lại trang
    window.location.href = "/"; // Chuyển hướng trang về "/"
  };

  const token = localStorage.getItem("authToken") || [];
  const handleClick = () => {
    setShow((prevShow) => !prevShow);
  };
  const createHandleMenuClick = (menuItem) => {
    return () => {
      console.log(`Clicked on ${menuItem}`);
    };
  };

  useEffect(() => {
    if (tokenEnabled && token) {
      console.log("thanh cong");
      axios
        .get(`http://localhost:3003/user/getDataUser/${token}`)
        .then((response) => {
          setLastName(response.data.lastName);
          console.log("last name of Navbar: ", lastName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tokenEnabled]);

  const items = [
    {
      key: "1",
      label: (
        <a
          rel="noopener noreferrer"
          href="/account"
          onClick={() => (window.location.href = "/account")}
        >
          Information
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={handleLogout}>
          Logout
        </a>
      ),
      icon: <SmileOutlined />,
    },
  ];

  return (
    <>
      <nav>
        <div>
          <span style={{}}>
            <NavLink
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img style={{ width: "50px" }} src="image/logo.png" alt="Logo" />
              <h1 style={{ color: "#fff" }}>SguPass</h1>
            </NavLink>
          </span>
        </div>
        <div>
          <ul id="navbar" className={`navbar ${show ? "active" : ""}`}>
            <li>
              {token ? (
                <NavLink exact to="/warehouse">
                  Warehouse
                </NavLink>
              ) : (
                <NavLink exact to="/login">
                  Warehouse
                </NavLink>
              )}
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li className="parent">
              {tokenEnabled ? (
                <NavLink>
                  <Dropdown
                    menu={{
                      items,
                    }}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        {lastName}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </NavLink>
              ) : (
                <NavLink to="/login">{lastName}</NavLink>
              )}
            </li>
          </ul>
        </div>
        <div id="mobile">
          {show ? (
            <FaTimes
              className="icon-navbar navbar active"
              onClick={handleClick}
            />
          ) : (
            <FaBars className="icon-navbar navbar" onClick={handleClick} />
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
