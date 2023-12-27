import { Button } from "antd";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Ring from "../Ring";

const ForgotPassword = ({ action, updateAction }) => {
  const [actionForgot, setActionForgot] = useState(action);
  const [email, setEmail] = useState("");
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (index, e) => {
    const value = e.target.value;
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const dataEmail = {
      email: email,
    };

    // Sử dụng setTimeout để kéo dài thời gian "loading" ít nhất 1 giây
    setTimeout(() => {
      // Thực hiện cuộc gọi API sử dụng Axios
      axios
        .post("http://localhost:3003/user/check-email", dataEmail)
        .then((response) => {
          console.log(response.data.check);
          if (response.data.check == "true") {
            axios
              .post("http://localhost:3003/user/send-code", dataEmail)
              .then((res) => {
                console.log(res.data);
                if (
                  (res.data.message == "Success",
                  {
                    position: "top-right",
                  })
                ) {
                  setActionForgot("Determined"); // Set sau khi API thứ 2 được nhận response
                } else {
                  toast.error("Something went wrong", {
                    position: "top-right",
                  });
                }
              })
              .catch((error) => {
                // Xử lý lỗi nếu có cho API thứ 2
                // ...
              });
          } else {
            toast.error("This email does not exist yet", {
              position: "top-right",
            });
          }
          setIsLoading(false);
        })
        .catch((error) => {
          // Xử lý lỗi nếu có cho API thứ 1
          // ...
          setIsLoading(false);
        });
    }, 1000); // 1000 milliseconds = 1 giây
  };

  const handleCodeSubmit = () => {
    const concatenatedValue = values.join("");
    console.log(concatenatedValue); // In ra chuỗi kết quả

    const dataCheckCode = {
      email: email,
      code: concatenatedValue,
    };

    console.log(dataCheckCode);

    setTimeout(() => {
      // Thực hiện cuộc gọi API sử dụng Axios
      axios
        .post("http://localhost:3003/user/check-code", dataCheckCode)
        .then((response) => {
          console.log(response.data.message);
          console.log(response.data.message === "Success");
          if (response.data.message === "Success") {
            window.location.href = `/change-password?token=${response.data.token}`;
          }
        })
        .catch((error) => {
          // Xử lý lỗi nếu có cho API thứ 1
          // ...
          setIsLoading(false);
        });
    }, 1000); // 1000 milliseconds = 1 giây
  };

  return (
    <div className="inputs">
      {isLoading ? (
        <>
          <Ring />
        </>
      ) : actionForgot === "Forgot Password" ? (
        <>
          <div className="input">
            <input
              style={{ width: "85%", paddingLeft: "10px" }}
              type="text"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChangeEmail}
            />
          </div>
          <Button
            style={{
              width: "60%",
              margin: "auto",
              color: "#fff",
              background: "black",
              borderRadius: "15px",
              height: "50px",
            }}
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </>
      ) : (
        <>
          <div className="text-center">
            <p>
              A code has been sent{" "}
              <span style={{ fontSize: "16px", fontWeight: "700" }}>
                {email}
              </span>
            </p>
          </div>
          <div className="code-input">
            {values.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                ref={inputRefs[index]}
                onChange={(e) => handleChange(index, e)}
              />
            ))}
          </div>
          <Button
            style={{
              width: "80%",
              margin: "auto",
              color: "#fff",
              background: "black",
              borderRadius: "15px",
              height: "50px",
              fontSize: "20px",
              fontWeight: "700",
            }}
            onClick={handleCodeSubmit}
          >
            Enter Code
          </Button>
        </>
      )}

      <div class="text-center fs-6">
        <a href="/login">Sign up</a> or <a href="/login">Sign in</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
