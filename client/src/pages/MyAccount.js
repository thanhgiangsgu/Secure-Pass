import { Space } from "antd";
import React, { useState } from "react";
import { Divider, Input, Button } from "antd";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MdToken } from "react-icons/md";

const MyAccount = ({ tokenEnabled }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const token = localStorage.getItem("authToken") || null;
  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:3003/user/getDataUser/${token}`)
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setPhoneNumber(response.data.phoneNumber);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tokenEnabled]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSaveClick = async () => {
    const newData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    };
    try {
      const res = await axios.patch(
        "http://localhost:3003/user/update-user",
        newData
      );
      const errors = res.data.errors || [];
      if (errors.length == 0) {
        toast.success("Cập nhật thành công", { position: "top-right" });
      } else {
        errors.map((error) => {
          toast.error(error, { position: "top-right" });
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Error", {
          position: "top-right",
        });
      } else {
        toast.error("Error", {
          position: "top-right",
        });
      }
    }
  };

  return (
    <Space direction="vertical">
      <h1 className="account-title">My Account</h1>
      <div className="divider"></div>
      <Space direction="vertical">
        <Space>
          <h2>First Name</h2>
          <Input
            name="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <h2>Last Name</h2>
          <Input
            name="lastName"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </Space>
        <Space>
          <h2>Email</h2>
          <Input
            name="email"
            value={email}
            onChange={handleEmailChange}
            disabled
          />
          <h2>Phone Number</h2>
          <Input
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
          />
          <Button type="primary" onClick={handleSaveClick}>
            Save
          </Button>
        </Space>
      </Space>

      <div className="divider"></div>
      <h1 className="account-title">Change Email</h1>

      <Space direction="horizontal">
        <h2>Password</h2>
        <Input />
        <h2>New Email</h2>
        <Input />
        <Button type="primary">Continue</Button>
      </Space>
    </Space>
  );
};

export default MyAccount;
