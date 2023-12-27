import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { Row, Container, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import { Space } from "antd";
import "./style.css";

function Home() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  return (
    <div>
      <Container>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          <Carousel.Item style={{ position: "relative" }}>
            <Image src="image/black-grd.jpg" alt="Slide 1" />
            <Button
              variant="outline-success"
              style={{
                position: "absolute",
                top: "20%",
                left: "30%",
                transform: "translate(-40%, -40%)",
                borderRadius: "50px",
              }}
              href="#"
            >
              Bắt đầu từ hôm nay
            </Button>
            <Image
              style={{
                position: "absolute",
                top: "30%",
                left: "70%",
                transform: "translate(-50%, -50%)",
                width: "20%",
                height: "60%",
              }}
              src="image/logo.png"
            />
            <Carousel.Caption>
              <h3>SGU Pass</h3>
              <p>
                Đối với những người muốn làm nhiều hơn, bảo mật hơn và cộng tác
                nhiều hơn, SGU Pass có thể thiết lập nhanh chóng và dễ dàng cho
                cả cá nhân và doanh nghiệp.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image src="image/black-grd.jpg" alt="Slide 2" />
            <Image
              style={{
                position: "absolute",
                top: "30%",
                left: "70%",
                transform: "translate(-50%, -50%)",
                width: "20%",
                height: "60%",
              }}
              src="image/logo.png"
            />
            <Carousel.Caption>
              <h3>Chia sẻ thông tin</h3>
              <p>Chia sẻ dữ liệu an toàn</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image src="image/black-grd.jpg" alt="Slide 3" />
            <Image
              style={{
                position: "absolute",
                top: "30%",
                left: "70%",
                transform: "translate(-50%, -50%)",
                width: "20%",
                height: "60%",
              }}
              src="image/logo.png"
            />
            <Carousel.Caption>
              <h3>Mật khẩu không giới hạn, thiết bị không giới hạn</h3>
              <p>
                Truy cập đa nền tảng cho các ứng dụng dành cho thiết bị di động,
                trình duyệt và máy tính để bàn
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Container>
      <Space
        direction="vertical"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 className="title mt-5">
          Everything you need out of a password manager
        </h3>
        <div className="card-list row d-flex align-items-center justify-content-center">
          <div className="card-container col-md-3">
            <div className="item-top-left">EASY</div>
            <div className="card-item__img d-flex align-items-center justify-content-center">
              <Image
                style={{
                  width: "300px",
                  height: "300px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                src="image/services/service1.png"
                alt="Slide 1"
              />
            </div>
            <h4 className="title">Powerful security within minutes</h4>
            <div className="card-item__content">
              For those who want to do more, secure more, and collaborate more,
              Bitwarden is fast and easy to set up for both individuals and
              businesses.
            </div>
          </div>

          <div className="card-container col-md-3">
            <div className="item-top-left">CONVENIENT</div>
            <div className="card-item__img d-flex align-items-center justify-content-center">
              <Image
                style={{ width: "500px", height: "300px" }}
                src="image/services/service2.png"
                alt="Slide 1"
              />
            </div>
            <h4 className="title">Unlimited passwords, unlimited devices</h4>
            <div className="card-item__content">
              Cross platform access for mobile, browser, and desktop apps.
              Supported in over 50 languages.
            </div>
          </div>

          <div className="card-container col-md-3">
            <div className="item-top-left">SECURE</div>
            <div className="card-item__img d-flex align-items-center justify-content-center">
              <Image
                style={{ width: "500px", height: "300px" }}
                src="image/services/service3.png"
                alt="Slide 1"
              />
            </div>
            <h4 className="title">Protect what's important to you</h4>
            <div className="card-item__content">
              Zero knowledge, end-to-end encryption guides the Bitwarden open
              source approach to trust, accountability, and security.
            </div>
          </div>
        </div>
      </Space>

      <Space
        direction="vertical"
        className="d-flex align-items-center justify-content-center card-list row"
        style={{ width: "70%", margin: " 50px auto" }}
      >
        <div className="card-container">
          <Space
            direction="horizontal"
            className="card-item__img d-flex align-items-center justify-content-center"
          >
            <Space>
              <Image
                style={{
                  width: "300px",
                  height: "300px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                src="image/services/service4.png"
                alt="Slide 1"
              />
            </Space>
            <Space direction="vertical">
              <h4 className="title">
                Generate, consolidate, and autofill strong and secure passwords
                for all your accounts
              </h4>
              <div className="card-item__content">
                Bitwarden gives you power to create and manage unique passwords
                and passkeys, so you can strengthen privacy and boost
                productivity online from any device or location.
              </div>
            </Space>
          </Space>
        </div>

        <div className="card-container">
          <Space
            direction="horizontal"
            className="card-item__img d-flex align-items-center justify-content-center"
          >
            <Space direction="vertical">
              <h4 className="title">
                Securely share encrypted information directly with anyone
              </h4>
              <div className="card-item__content">
                Bitwarden Send is a feature that allows all users to transmit
                data directly to others, while maintaining end-to-end encrypted
                security and limiting exposure.
              </div>
            </Space>
            <Space>
              <Image
                style={{
                  width: "300px",
                  height: "300px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                src="image/services/service5.png"
                alt="Slide 1"
              />
            </Space>
          </Space>
        </div>

        <div className="card-container">
          <Space
            direction="horizontal"
            className="card-item__img row d-flex align-items-center justify-content-center"
          >
            <Space>
              <Image
                style={{
                  width: "300px",
                  height: "300px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                src="image/services/service6.png"
                alt="Slide 1"
              />
            </Space>
            <Space direction="vertical">
              <h4 className="title">
                Gain peace of mind with comprehensive compliance
              </h4>
              <div className="card-item__content">
                Protect your online data using a password manager you can trust.
                Bitwarden conducts regular third-party security audits and is
                compliant with GDPR, SOC 2, HIPAA, Privacy Shield, and CCPA
                standards.
              </div>
            </Space>
          </Space>
        </div>
      </Space>
    </div>
  );
}

export default Home;
