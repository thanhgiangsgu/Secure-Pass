import React from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineKey } from "react-icons/ai";
const LoginSignupInputs = ({ action }) => {
  return (
    <div className="inputs">
      <div className="two-forms">
        {action === "Sign Up" && (
          <>
            <div className="input">
              <input type="text" placeholder="First Name" />
            </div>
            <div className="input">
              <input type="text" placeholder="Last Name" />
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
        />
      </div>
      <div className="input">
        {/* <AiOutlineKey className="icon" /> */}
        <input
          style={{ paddingLeft: "20px" }}
          type="password"
          placeholder="Password"
        />
      </div>
    </div>
  );
};

export default LoginSignupInputs;
