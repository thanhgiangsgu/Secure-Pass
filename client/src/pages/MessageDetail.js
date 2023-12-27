import React, { useState } from "react";
import { Button, Input, Space, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const MessageDetail = () => {
  const initState = {
    email: "",
    text: "",
  };
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const [messageDetail, setMessageDetail] = useState(initState);
  const { email, text } = messageDetail;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("_id");

  const handleChangeInput = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    const data = {
      token: token,
      password: password,
    };
    console.log(data);
    axios
      .post("http://localhost:3003/message/check-message", data)
      .then((response) => {
        if (response.data.check) {
          setMessageDetail(response.data.resMess);
          setCheck(true);
        } else {
          const errors = response.data.errors;
          errors.map((error) => {
            toast.error(error, {
              position: "top-right",
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCopy = () => {
    const messageBox = document.querySelector(".box-message");

    if (messageBox) {
      const textToCopy = messageBox.textContent || messageBox.innerText;

      // Create a temporary textarea element
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;

      // Make it invisible
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";

      // Append the textarea to the document
      document.body.appendChild(textarea);

      // Select and copy the text
      textarea.select();
      document.execCommand("copy");

      // Remove the temporary textarea
      document.body.removeChild(textarea);

      // Show a success message
      message.success("Text copied to clipboard");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "30%",
        margin: "5% auto",
      }}
    >
      <div>
        <Space
          direction="vertical"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>SguPass Send</h3>
          {check ? (
            <div className="container" style={{ width: "700px" }}>
              <h6 style={{ textAlign: "center" }}>
                SguPass user {email} shared the following with you
              </h6>
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  border: "3px solid #333",
                  borderRadius: "10px",
                  background: "#e0e0e0",
                }}
                className="box-message"
              >
                {text}
              </div>

              <Button
                type="primary"
                style={{ width: "100%", marginTop: "5%" }}
                onClick={handleCopy}
              >
                Copy
              </Button>
            </div>
          ) : (
            <div className="container">
              <h6>
                This send is password protected. Please enter your password
                below to continue.
              </h6>
              <h6>
                Don't know the password? Ask the sender for the password needed
                to access this Send.
              </h6>
              <h5>Password</h5>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={handleChangeInput}
              />
              <Button
                type="primary"
                style={{ width: "100%", marginTop: "5%" }}
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};

export default MessageDetail;
