const bcrypt = require("bcrypt");
const MessageModal = require("../models/Message");
const AccessCountDetailModal = require("../models/AccessCountDetail");
const UserModal = require("../models/User");
const AuditLogModal = require("../models/AuditLog");
const { formatISO } = require("date-fns");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const crypto = require("crypto");
const fs = require("fs");
const privateKey = fs.readFileSync("./private_key.pem", "utf-8");
const publicKey = fs.readFileSync("./public_key.pem", "utf-8");

class Message {
  async addMessage(req, res) {
    console.log("Join to addMessage");
    console.log(req.body);
    const generateToken = (_id) => {
      // Điều này chỉ là ví dụ, bạn cần thay đổi 'yourSecretKey' thành một khóa bí mật thực sự
      const secretKey = "thanhyarn";

      // Tạo token với _id như là một phần của payload
      const token = jwt.sign({ _id }, secretKey); // Điều này sẽ hết hạn sau 1 giờ

      return token;
    };

    const {
      title,
      text,
      password,
      startDate,
      endDate,
      maximumAccessCount,
      note,
    } = req.body;

    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    const startDateISO = formatISO(parseInt(startDate, 10));
    const endDateISO = formatISO(parseInt(endDate, 10));

    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      const encryptedText = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(text)
      );
      const encryptedTextBase64 = encryptedText.toString("base64");

      // Create a new message record
      const newMessage = new MessageModal({
        user_id,
        title,
        text: encryptedTextBase64,
        password: hashedPassword,
        startDate: startDateISO,
        endDate: endDateISO,
        maximumAccessCount,
        note,
      });

      // Save the new message record to the database
      await newMessage.save();

      newMessage.urlSend = `http://localhost:3000/message/?_id=${generateToken(
        newMessage._id
      )}`;
      // Cập nhật newMessage trong cơ sở dữ liệu với giá trị mới của urlSend
      await MessageModal.findByIdAndUpdate(
        newMessage._id,
        { urlSend: newMessage.urlSend },
        { new: true }
      );

      // Tạo AccessCountDetail với thông tin tương ứng
      const newAccessCountDetail = await AccessCountDetailModal.create({
        message_id: newMessage._id,
        accessedSuccess: 0,
        accessedFailure: 0,
      });
      await newAccessCountDetail.save();

      const data = {
        user_id: user_id,
        title: title,
        text: text,
        password: hashedPassword,
        startDate: startDateISO,
        endDate: endDateISO,
        maximumAccessCount: maximumAccessCount,
        note: note,
        accessedSuccess: newAccessCountDetail.accessedSuccess,
        accessedFailure: newAccessCountDetail.accessedFailure,
      };

      const newAuditLog = new AuditLogModal({
        user_id: user_id,
        content: "Add Data Message",
      });

      await newAuditLog.save();

      // Return a successful response
      res.status(201).json({
        status: "Success",
        data,
      });
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async updateMessage(req, res) {
    console.log("Join to updateMessage");

    const {
      _id,
      title,
      text,
      createDate,
      startDate,
      endDate,
      maximumAccessCount,
      password,
      note,
    } = req.body;

    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    // Assume you have a function to hash the password
    const hashPassword = async (plainPassword) => {
      const saltRounds = 10;
      return await bcrypt.hash(plainPassword, saltRounds);
    };

    // Check if password exists and hash it if it does
    const hashedPassword =
      password !== undefined ? await hashPassword(password) : undefined;

    try {
      const encryptedText = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(text)
      );
      const encryptedTextBase64 = encryptedText.toString("base64");
      // Find the existing message record based on _id
      const existingMessage = await MessageModal.findByIdAndUpdate(
        _id,
        {
          user_id: user_id,
          title: title,
          text: encryptedTextBase64,
          password: hashedPassword,
          createDate: createDate,
          startDate: startDate,
          endDate: endDate,
          maximumAccessCount: maximumAccessCount,
          note: note,
        },
        { new: true }
      );

      const newAuditLog = new AuditLogModal({
        user_id: user_id,
        content: "Update Data Message",
      });

      await newAuditLog.save();

      // Return a successful response with the updated message record
      res.status(200).json({
        status: "Success",
        data: {
          existingMessage,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "Failed",
        message: "Internal server error",
      });
    }
  }

  async deleteMessage(req, res) {
    const { token, _id } = req.params;
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    console.log("Join to deleteMessage");
    try {
      // Find and delete the existing message record based on _id
      const result = await MessageModal.findOneAndDelete({
        _id: _id,
      });

      if (!result) {
        // If the message record is not found
        res.status(404).json({
          status: "Failed",
          message: "Message record not found",
        });
      } else {
        // Message record successfully deleted

        const newAuditLog = new AuditLogModal({
          user_id: user_id,
          content: "Delete Data Message",
        });

        await newAuditLog.save();
        res.status(204).json({
          status: "Success",
          data: {},
        });
      }
    } catch (error) {
      // Handle error if there's an error during the findOneAndDelete() operation
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async showAllMessageWidhUserId(req, res) {
    try {
      const token = req.params.id;
      const decoded = jwt.verify(token, "thanhyarn");
      const user_id = decoded.userId;

      // Truy vấn lấy dữ liệu từ bảng Message
      const messages = await MessageModal.find({
        user_id: user_id,
      });

      // Lấy danh sách các message_id từ kết quả truy vấn trước
      const messageIds = messages.map((message) => message._id);

      // Truy vấn lấy dữ liệu từ bảng AccessCountDetail với message_id tương ứng
      const accessCountDetails = await AccessCountDetailModal.find({
        message_id: { $in: messageIds },
      });

      // Kết hợp dữ liệu từ cả hai bảng
      const mergedData = messages.map((message) => {
        const accessCountDetail = accessCountDetails.find(
          (detail) => detail.message_id.toString() === message._id.toString()
        );
        // Giải mã mật khẩu từ cơ sở dữ liệu
        const decryptedTextBuffer = crypto.privateDecrypt(
          {
            key: privateKey, // Sử dụng khóa riêng tư để giải mã
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(message.text, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
        );
        const decryptedTextString = decryptedTextBuffer.toString("utf-8");

        return {
          _id: message._id,
          user_id: message.user_id,
          title: message.title,
          text: decryptedTextString,
          password: message.password,
          startDate: message.startDate,
          endDate: message.endDate,
          maximumAccessCount: message.maximumAccessCount,
          note: message.note,
          accessedSuccess: accessCountDetail
            ? accessCountDetail.accessedSuccess
            : 0,
          accessedFailure: accessCountDetail
            ? accessCountDetail.accessedFailure
            : 0,
        };
      });

      res.json(mergedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async checkMessage(req, res) {
    try {
      const { token, password } = req.body;
      const errors = [];
      let check = false;

      // Giải mã token để lấy _id
      const decoded = jwt.verify(token, "thanhyarn");
      const { _id } = decoded;

      // Tìm Message theo _id
      const message = await MessageModal.findById(_id);

      if (!message) errors.push("Thông tin Message không tồn tại");
      const now = Date.now();

      // So sánh password sử dụng bcrypt.compare
      const passwordMatch = await bcrypt.compare(password, message.password);

      // So sánh password
      if (!passwordMatch) {
        errors.push("Mật khẩu không khớp");
        const { headers, ip, method, originalUrl } = req;

        // Lấy thông tin từ máy khách và xử lý
        const clientInfo = {
          headers,
          ip,
          method,
          originalUrl,
        };

        // Lưu thông tin vào biến hoặc log lại
        console.log("Thông tin máy khách:", clientInfo);
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "thanhgiangdz@gmail.com",
            pass: "uvpi dwcw rxkn pmlk",
          },
        });

        var mailOptions = {
          from: "thanhgiangdz@gmail.com",
          to: "giangproit@gmail.com",
          subject: "Thông báo truy cập Message",
          text: `Thông tin máy khách cố truy cập vào Message\n ${JSON.stringify(
            clientInfo
          )}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
            res.json({ message: "Success" });
          }
        });
      } else {
        if (now >= message.startDate && now <= message.endDate) {
          if (message.maximumAccessCount > message.accessCount) {
            check = true;
          } else {
            errors.push("Số lần truy cập đã đạt giới hạn");
          }
        } else {
          errors.push("Message hết hạn");
        }
      }

      const updateField = check ? "accessedSuccess" : "accessedFailure";

      // Cập nhật trường accessCountDetailModal[updateField] bằng cách cộng thêm 1
      const result = await AccessCountDetailModal.updateOne(
        { message_id: message._id },
        { $inc: { [updateField]: 1 } } // Sử dụng $inc để tăng giá trị của trường
      );

      if (result.nModified > 0) {
        console.log(`Cập nhật ${updateField} thành công`);
      } else {
        console.log(
          `Không tìm thấy AccessCountDetail hoặc không có sự thay đổi`
        );
      }

      await MessageModal.updateOne(
        { _id: message._id }, // Điều kiện để xác định message cần cập nhật
        { $inc: { accessCount: 1 } } // Sử dụng $inc để tăng giá trị của trường accessCount
      );

      const messageDetails = await MessageModal.findById(message._id).populate(
        "user_id"
      );

      const { user_id, text } = messageDetails;

      // Lấy thông tin từ Modal User
      const user = await UserModal.findById(user_id);

      if (!user) {
        errors.push("Nguoi dung khong con ton tai ");
      }

      // Lấy email từ thông tin người dùng
      const { email } = user;

      // Trả về dữ liệu mong muốn
      const resMess = { email, text };

      console.log(text);

      //Giải mã mật khẩu từ cơ sở dữ liệu
      const decryptedTextBuffer = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(text, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );
      const decryptedPasswordString = decryptedTextBuffer.toString("utf-8");

      console.log(decryptedPasswordString);

      if (check) {
        res.json({
          check,
          resMess: {
            email: email,
            text: decryptedPasswordString,
          },
        });
      } else {
        res.json({
          check,
          errors,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "Error", message: "Internal Server Error" });
    }
  }

  async showAllMessage(req, res) {
    console.log("oke ");
    try {
      // Retrieve all message records
      const messages = await MessageModal.find();

      // Return a successful response with the message records
      res.status(200).json({
        status: "Success",
        data: {
          messages,
        },
      });
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async showMessageById(req, res) {
    console.log("oke showMessageById");
    console.log(req.params.id);
    try {
      // Find the message record based on _id
      const message = await MessageModal.findById(req.params.id);

      if (!message) {
        // If the message record is not found
        res.status(404).json({
          status: "Failed",
          message: "Message record not found",
        });
      } else {
        // Giải mã mật khẩu từ cơ sở dữ liệu
        const decryptedTextBuffer = crypto.privateDecrypt(
          {
            key: privateKey, // Sử dụng khóa riêng tư để giải mã
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(message.text, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
        );
        const decryptedTextString = decryptedTextBuffer.toString("utf-8");
        res.status(200).json({
          status: "Success",

          message: {
            _id: message._id,
            title: message.title,
            text: decryptedTextString,
            startDate: message.startDate,
            endDate: message.endDate,
            maximumAccessCount: message.maximumAccessCount,
            urlSend: message.urlSend,
            accessCount: message.accessCount,
            note: message.note,
          },
        });
      }
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async changeMessagePassword(req, res) {
    console.log("oke changeMessagePassword");
    const { messageId, currentPassword, newPassword } = req.body;

    try {
      // Find the message record based on messageId
      const message = await MessageModal.findById(messageId);

      if (!message) {
        // If the message record is not found
        res.status(404).json({
          status: "Failed",
          message: "Message record not found",
        });
      } else {
        // Compare the current password with the stored hashed password
        const passwordMatch = await bcrypt.compare(
          currentPassword,
          message.password
        );

        if (!passwordMatch) {
          // If the current password doesn't match the stored password
          res.status(400).json({
            status: "Failed",
            message: "Current password is incorrect",
          });
        } else {
          // Hash the new password
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          // Update the password of the message record
          message.password = hashedNewPassword;
          await message.save();

          // Return a successful response
          res.status(200).json({
            status: "Success",
            message: "Password successfully changed",
          });
        }
      }
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async notifyOnMessageAccess(req, res) {
    console.log("oke notifyOnMessageAccess");
    const { messageId } = req.body;

    try {
      // Find the message record based on messageId
      const message = await MessageModal.findById(messageId);

      if (!message) {
        // If the message record is not found
        res.status(404).json({
          status: "Failed",
          message: "Message record not found",
        });
      } else {
        // Send notification to the email address
        const transporter = nodemailer.createTransport({
          // Configure the transporter for sending emails (e.g., Gmail SMTP)
          // ...
        });

        const mailOptions = {
          from: "your-email@example.com",
          to: "thanhgiangdz@gmail.com",
          subject: "Notification: Your message has been accessed",
          text: "Your message has been accessed by someone.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.status(500).json({
              status: "Failed",
              message: "Error sending notification email",
            });
          } else {
            // Return a successful response
            res.status(200).json({
              status: "Success",
              message: "Notification email sent",
            });
          }
        });
      }
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async overviewStatistics(req, res) {
    console.log("oke overviewStatistics");
    try {
      // Count the total number of message records
      const totalMessages = await MessageModal.countDocuments();

      // Aggregate the total access count for all message records
      const totalAccessCount = await MessageModal.aggregate([
        {
          $group: {
            _id: null,
            totalAccessCount: { $sum: "$accessCount" },
          },
        },
      ]);

      // Find the top 5 messages with the highest access count
      const topMessages = await MessageModal.find()
        .sort({ accessCount: -1 })
        .limit(5);

      // Return a successful response with the overview statistics
      res.status(200).json({
        status: "Success",
        data: {
          totalMessages,
          totalAccessCount:
            totalAccessCount.length > 0
              ? totalAccessCount[0].totalAccessCount
              : 0,
          topMessages,
        },
      });
    } catch (error) {
      // Return an error response
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }
}

module.exports = new Message();
