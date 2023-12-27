import React, { useState } from "react";
import { Space, Input, Button, Progress } from "antd";
import "./Account.css";
import toast from "react-hot-toast";
import axios from "axios";

const PasswordStrengthMeter = ({ password }) => {
  // Đánh giá mức độ mạnh của mật khẩu ở đây
  // Bạn có thể sử dụng các tiêu chí của riêng bạn để đánh giá mật khẩu
  const calculateStrength = (password) => {
    // Ví dụ: Kiểm tra độ dài của mật khẩu
    if (password.length < 6) {
      return 0;
    }

    // Ví dụ: Kiểm tra sự kết hợp của chữ cái, số và ký tự đặc biệt
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(password);

    // Tính điểm dựa trên các tiêu chí
    let strength = 0;
    if (hasLetter) strength++;
    if (hasNumber) strength++;
    if (hasSpecialCharacter) strength++;

    return strength;
  };

  const strength = calculateStrength(password);

  return (
    <Progress
      percent={(strength / 3) * 100} // Điểm mạnh chia cho 3 để có giá trị từ 0-100
      status={strength === 3 ? "success" : "exception"}
      showInfo={false}
    />
  );
};

const ChangePass = () => {
  const user_id = localStorage.getItem("user_id");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const token = localStorage.getItem("authToken") || "";

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const handleChangeNewConfirmPassword = (e) => {
    setNewConfirmPassword(e.target.value);
  };

  const handleConfirmation = () => {
    console.log("Okay");
  };

  const handleSaveClick = async () => {
    const dataChangePassword = {
      password: password,
      newPassword: newPassword,
      newConfirmPassword: newConfirmPassword,
    };

    try {
      const res = await axios.patch(
        "http://localhost:3003/user/update-password",
        dataChangePassword,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );
      const errors = res.data.errors;
      if (errors.length > 0) {
        errors.map((error) => {
          toast.error(error, {
            position: "top-right",
          });
        });
      } else {
        toast
          .promise(
            // Thay thế bằng promise hoặc async function của bạn
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 3000); // Tạo một khoảng thời gian 1000ms (1 giây) trước khi hoàn thành promise
            }),
            {
              loading:
                "Password changed successfully, automatically logged out in a few seconds....",
              success: "Success",
              error: "Error!",
            },
            { position: "top-right" }
          )
          .then(() => {
            // Xử lý sau khi promise hoàn thành thành công
            // Xóa localStorage, tải lại trang, và thực hiện các tác vụ khác
            localStorage.removeItem("authToken");
            localStorage.removeItem("user_id");
            window.location.href = "/";
          })
          .catch((error) => {
            // Xử lý sau khi promise bị lỗi
            console.error(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Space direction="vertical">
      <h1 className="account-title">Change Password</h1>
      <div class="warning">
        <strong class="waring-title">WARING</strong>
        <p>
          Continue will log you out of the current session, requiring you to log
          in again. Sessions on other devices will continue to be valid for up
          to 1 hour.
        </p>
      </div>
      <div className="divider"></div>
      <Space direction="vertical">
        <Space style={{ width: "350px" }} direction="vertical">
          <h2>Current password</h2>
          <Input
            name="password"
            value={password}
            onChange={handleChangePassword}
            type="password"
          />
        </Space>

        <Space direction="horizontal">
          <Space style={{ width: "350px" }} direction="vertical">
            <h2>New password</h2>
            <Input
              name="newPassword"
              value={newPassword}
              onChange={handleChangeNewPassword}
              type="password"
            />
          </Space>
          <Space style={{ width: "350px" }} direction="vertical">
            <h2>Confirm new password</h2>
            <Input
              name="newConfirmPassword"
              value={newConfirmPassword}
              type="password"
              onChange={handleChangeNewConfirmPassword}
            />
          </Space>
        </Space>
        <PasswordStrengthMeter password={newPassword} />
      </Space>

      <div className="divider"></div>

      <Button onClick={handleSaveClick} type="primary">
        Change password
      </Button>
    </Space>
  );
};

export default ChangePass;
