const Feedback = require("../models/feedbackModel");
const UserModel = require("../models/User"); // Import model của người dùng
const AuditLogModal = require("../models/AuditLog");

const nodemailer = require("nodemailer");

// Hàm kiểm tra tồn tại của địa chỉ email
const isEmailRegistered = async (email) => {
  const user = await UserModel.findOne({ email: email });
  return user !== null;
};

// Hàm xử lý phản hồi
const handleFeedback = async (req, res) => {
  const { fullName, email, phoneNumber, feedback } = req.body;
  const errors = [];

  // Kiểm tra fullName không được rỗng
  if (!fullName || fullName.trim() === "") {
    errors.push("Full name is required");
  }

  // Kiểm tra email có định dạng hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  // Kiểm tra số điện thoại có định dạng hợp lệ
  const phoneRegex = /^0[0-9]{9,10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    errors.push("Invalid phone number format");
  }

  // Kiểm tra feedback không được rỗng
  if (!feedback || feedback.trim() === "") {
    errors.push("Feedback is required");
  }

  // Kiểm tra xem địa chỉ email đã đăng kí trong hệ thống chưa
  // if (!(await isEmailRegistered(email))) {
  //   return res.status(400).json({ message: "Email chưa được đăng ký" });
  // }

  if (errors.length > 0) {
    res.json({ status: "Falied", errors });
  } else {
    try {
      // Lưu phản hồi vào cơ sở dữ liệu
      const newFeedback = new Feedback({
        fullName,
        email,
        phoneNumber,
        feedback,
      });
      await newFeedback.save();

      // Cấu hình máy chủ SMTP của Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "leduykhanhqn123@gmail.com", // Thay bằng địa chỉ email của bạn
          pass: "cblk cbkt tkah oywv", // Thay bằng mật khẩu của bạn
        },
      });

      const mailOptions = {
        from: "leduykhanhqn123@gmail.com",
        to: "thanhgiang.user@gmail.com",
        subject: "New Feedback Received",
        text: `Tên người liên hệ: ${fullName}\nSố điện thoại: ${phoneNumber}\nEmail: ${email}\nNội dung phản hồi: ${feedback}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ message: "Error sending email to admin" });
        } else {
          console.log("Email sent: " + info.response);
          res.status(201).json({
            status: "Success",
            message: "Feedback received and email sent to admin",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = { handleFeedback };
