import "./App.css";
import Navbar from "./components/Navbar";
import { Fragment, useEffect } from "react";
import { useState } from "react";
import toast, { Toaster, ToastProvider } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Warehouse from "./pages/Warehouse";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Share from "./pages/Share";
import Register from "./pages/Register";
import axios from "axios";
import Account from "./pages/Account";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import ChangePassword from "./components/ChangePassword";
import Dashboard from "./pages/Dashboard";
import MessageDetail from "./pages/MessageDetail";
import Contact from "./pages/Contact";
function App() {
  const [tokenEnabled, setTokenEnabled] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    console.log(token);

    axios
      .get("http://localhost:3003/user/token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTokenEnabled(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Token không hợp lệ, sử dụng refreshToken để làm mới token
          const refreshToken = localStorage.getItem("refreshToken") || "";

          axios
            .post("http://localhost:3003/user/refresh-token", {
              refreshToken,
            })
            .then((refreshResponse) => {
              console.log(refreshResponse.data);
              const newToken = refreshResponse.data.token;
              localStorage.setItem("authToken", newToken);
              setTokenEnabled(true);
            })
            .catch((refreshError) => {
              // Xử lý lỗi khi làm mới token
              console.error("Error refreshing token:", refreshError);
            });
        }
      });
  }, []);
  return (
    <BrowserRouter>
      <Navbar tokenEnabled={tokenEnabled} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/warehouse" element={<Dashboard id={"warehouse"} />} />
        <Route path="/share" element={<Share id={"upcoming"} />} />
        <Route path="/tools" element={<Tools id={"tools"} />} />
        <Route path="/report" element={<Report id={"contact"} />} />
        <Route path="/account" element={<Account id={"account"} />} />
        <Route path="/message" element={<MessageDetail id={"account"} />} />
        <Route path="/contact" element={<Contact id={"contact"} />} />
        <Route
          path="/login"
          element={<LoginSignup id={"login"} tokenEnabled={tokenEnabled} />}
        />
        <Route path="/register" element={<Register id={"register"} />} />
        <Route
          path="/change-password"
          element={<ChangePassword id={"changePassword"} />}
        />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
