import React, { useEffect, useState } from "react";
import "./LoginSignup.css";
import ForgotPassword from "./ForgotPassword";
import LoginSignupInputs from "./LoginSignupInputs";
import axios from "axios";
import toast from "react-hot-toast";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confimPassword: "",
};

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [user, setUser] = useState(initialState);
  const { firstName, lastName, email, password, confirmPassword } = user;

  useEffect(() => {}, [action]);

  const updateAction = (newAction) => {
    setAction(newAction);
  };

  const handleLoginClick = (e) => {
    setUser(initialState);
    if (action === "Sign Up") {
      setAction("Login");
    } else {
      const dataLogin = {
        email: user.email,
        password: user.password,
      };
      axios
        .post("http://localhost:3003/user/login", dataLogin)
        .then((res) => {
          if (res.data.message == "Success") {
            toast.success("Login Successful", {
              position: "top-right",
            });
            localStorage.setItem("authToken", res.data.token);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            window.location.href = "/";
          } else {
            toast.error(res.data.message, {
              position: "top-right",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleSignUpClick = async (e) => {
    setUser(initialState);
    if (action === "Login") {
      setAction("Sign Up");
    } else {
      console.log("Handle Sign Up");

      axios
        .post("http://localhost:3003/user/register", user)
        .then((response) => {
          const errors = response.data.errors;
          if (errors.length > 0) {
            errors.map((error) => {
              toast.error(error, {
                position: "top-right",
              });
            });
          } else {
            toast.success("Success", {
              position: "top-right",
            });
            const dataUser = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              password: user.password,
              phoneNumber: "",
              passwordResetToken: null,
              passwordResetExpires: null,
            };
            axios
              .post("http://localhost:3003/user/add-user", dataUser)
              .then((response) => {
                if (response.data.check == "Success") {
                  toast.success("Account successfully created", {
                    position: "top-right",
                  });
                  window.location.href = "/";
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {});
    }
  };

  const handleForgotPassword = () => {
    setAction("Forgot Password");
    console.log(action);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    console.log(user);
  };

  return (
    <div className="login-signin-container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      {action === "Forgot Password" ? (
        // Render nội dung khi action là 'forgotPassword'
        <ForgotPassword action={action} updateAction={updateAction} />
      ) : (
        <>
          <div className="inputs">
            <div className="two-forms">
              {action === "Sign Up" && (
                <>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={firstName}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="input">
                    <input
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      value={lastName}
                      onChange={handleChangeInput}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="input">
              {/* <AiOutlineMail className="icon" /> */}
              <input
                type="text"
                placeholder="Email"
                style={{ paddingLeft: "20px" }}
                name="email"
                value={email}
                onChange={handleChangeInput}
              />
            </div>
            <div className="input">
              {/* <AiOutlineKey className="icon" /> */}
              <input
                style={{ paddingLeft: "20px" }}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChangeInput}
              />
            </div>
            {action === "Sign Up" && (
              <div className="input">
                {/* <AiOutlineKey className="icon" /> */}
                <input
                  style={{ paddingLeft: "20px" }}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChangeInput}
                />
              </div>
            )}
          </div>
          <div className="forgot-password">
            Lost Password?{" "}
            <span onClick={handleForgotPassword}>Click Here!</span>
          </div>

          <div className="submit-container">
            <div
              onClick={handleSignUpClick}
              className={action === "Login" ? "submit gray mt-80" : "submit"}
            >
              Sign Up
            </div>
            <div
              onClick={handleLoginClick}
              className={action === "Sign Up" ? "submit gray" : "submit  mt-80"}
            >
              Login
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginSignup;
