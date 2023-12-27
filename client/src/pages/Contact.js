import React, { useState } from "react";
import "./Contact.css";
import {
  AiFillInstagram,
  AiFillPhone,
  AiOutlineMail,
  AiFillFacebook,
  AiFillLinkedin,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const initalState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  feedback: "",
};

const Contact = () => {
  const [info, setInfo] = useState(initalState);
  const { fullName, email, phoneNumber, feedback } = info;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:3003/feedback", info)
      .then((response) => {
        if (response.data.status == "Success") {
          toast.success("Request sent successfully", {
            position: "top-right",
          });
        } else {
          const errors = response.data.errors;
          errors.map((error) => {
            toast.error(error, {
              position: "top-right",
            });
          })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="contactUs">
      <div className="title">
        <h2>Get in Touch</h2>
      </div>

      <div className="box">
        <div className="contact form">
          <h3>Send Message</h3>
          <div>
            <div className="formBox">
              <div className="row100">
                <div className="inputBox">
                  <span>Full Name</span>
                  <input
                    type="text"
                    placeholder="Join Doe"
                    name="fullName"
                    value={fullName}
                    id="fullName"
                    onChange={handleChangeInput}
                  />
                </div>
              </div>

              <div className="row50">
                <div className="inputBox">
                  <span>Email</span>
                  <input
                    type="text"
                    placeholder="example@gmail.com"
                    name="email"
                    value={email}
                    id="email"
                    onChange={handleChangeInput}
                  />
                </div>
                <div className="inputBox">
                  <span>Mobile</span>
                  <input
                    type="number"
                    placeholder="+84 3570 5 777 5"
                    name="phoneNumber"
                    value={phoneNumber}
                    id="phoneNumber"
                    onChange={handleChangeInput}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
              </div>

              <div className="row100">
                <div className="inputBox">
                  <span>Message</span>
                  <textarea
                    type="text"
                    placeholder="Write your message here..."
                    value={feedback}
                    name="feedback"
                    id="feedback"
                    onChange={handleChangeInput}
                  />
                </div>
              </div>

              <div className="row100">
                <div className="inputBox">
                  <input type="submit" value={"Send"} onClick={handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact info">
          <h3>Contact Info</h3>
          <div className="infoBox">
            <div>
              <span>
                <FaMapMarkerAlt />
              </span>
              <p>
                273 An Duong Vuong Ward 3 District 5 <br />
                Saigon City
              </p>
            </div>

            <div>
              <span>
                <AiOutlineMail />
              </span>
              <a href="mailto:supportsgupass@gmail.com">
                support.sgupass@gmail.com
              </a>
            </div>

            <div>
              <span>
                <AiFillPhone />
              </span>
              <a href="tel:+84357057775">0 3570 57775</a>
            </div>

            <ul className="sci">
              <li>
                <a href="">
                  <AiFillInstagram />
                </a>
                <a href="">
                  <AiFillFacebook />
                </a>
                <a href="">
                  <AiFillLinkedin />
                </a>
                <a href="">
                  <AiFillTwitterCircle />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="contact map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.622040148937!2d106.66450094788576!3d10.780221709798562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1700486482356!5m2!1svi!2s"
            width="600"
            height="450"
            style={{ border: "0px", width: "400px", height: "300px" }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
