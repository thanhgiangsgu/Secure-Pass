const PasswordRecordModel = require("../models/PasswordRecord");
const AuditLogModal = require("../models/AuditLog");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const privateKey = fs.readFileSync("./private_key.pem", "utf-8");
const publicKey = fs.readFileSync("./public_key.pem", "utf-8");
class PasswordRecord {
  async addPasswordRecord(req, res) {
    console.log("oke ");
    const { title, username, password, url, note } = req.body;
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    const errors = [];
    if (title == "") errors.push("Tiêu đề không được để trống");
    if (username == "") errors.push("Tên người dùng không được để trống");
    if (password == "") errors.push("Mật khẩu không được để trống");
    if (errors.length > 0) {
      res.json({ mesage: "Falied", errors });
    } else {
      try {
        const encryptedUsername = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(username)
        );
        const encryptedUsernameBase64 = encryptedUsername.toString("base64");

        const encryptedPassword = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(password)
        );
        const encryptedPasswordBase64 = encryptedPassword.toString("base64");

        // Tạo một đối tượng bản ghi mật khẩu mới
        const newPasswordRecord = new PasswordRecordModel({
          user_id,
          title,
          username: encryptedUsernameBase64,
          password: encryptedPasswordBase64,
          url,
          note,
          createDate: Date.now(),
        });

        // Lưu đối tượng bản ghi mật khẩu mới vào cơ sở dữ liệu
        await newPasswordRecord.save();

        const newAuditLog = new AuditLogModal({
          user_id: user_id,
          content: "Add Data Password Record",
        });

        await newAuditLog.save();

        // Trả về phản hồi thành công
        res.status(201).json({
          message: "Success",
          data: {
            newPasswordRecord,
          },
        });
      } catch (error) {
        // Trả về phản hồi lỗi
        res.status(500).json({
          check: "false",
          message: error.message,
        });
      }
    }
  }

  async updatePasswordRecord(req, res) {
    console.log("Join to updatePasswordRecord");
    const { _id, title, username, password, url, note } = req.body;
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    console.log(_id);

    try {
      const encryptedUsername = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(username)
      );
      const encryptedUsernameBase64 = encryptedUsername.toString("base64");

      const encryptedPassword = crypto.publicEncrypt(
        {
          key: publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(password)
      );
      const encryptedPasswordBase64 = encryptedPassword.toString("base64");

      // Tìm kiếm bản ghi mật khẩu hiện có dựa trên _id
      const existingPasswordRecord =
        await PasswordRecordModel.findByIdAndUpdate(
          _id,
          {
            title: title,
            username: encryptedUsernameBase64,
            password: encryptedPasswordBase64,
            url: url,
            note: note,
            createDate: Date.now(),
          },
          { new: true }
        );

      const newAuditLog = new AuditLogModal({
        user_id: user_id,
        content: "Update Data Password Record",
      });

      await newAuditLog.save();

      // Trả về phản hồi thành công với thông tin về bản ghi mật khẩu đã cập nhật
      res.status(200).json({
        status: "Success",
        data: {
          existingPasswordRecord,
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

  async deletePasswordRecord(req, res) {
    console.log("Join to deletePasswordRecord");

    const { token, _id } = req.params;

    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    try {
      // Tìm kiếm bản ghi mật khẩu hiện có dựa trên _id
      const result = await PasswordRecordModel.findOneAndDelete({
        _id: _id,
      });

      if (!result) {
        // Không tìm thấy bản ghi mật khẩu
        res.status(404).json({
          status: "Failed",
          message: "Password record not found",
        });
      } else {
        const newAuditLog = new AuditLogModal({
          user_id: user_id,
          content: "Delete Data Password Record",
        });

        await newAuditLog.save();
        // Bản ghi mật khẩu đã được xóa thành công
        res.status(204).json({
          status: "Success",
          data: {},
        });
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi trong quá trình thực hiện findOneAndDelete()
      res.status(500).json({
        status: "Failed",
        message: error.message,
      });
    }
  }

  async showAllData(req, res) {
    console.log("oke ");
    try {
      const passwordRecords = await PasswordRecordModel.find(
        {},
        "_id user_id title username password url note"
      );

      if (passwordRecords.length === 0) {
        return res.status(200).json({
          message: "No data found in the database.",
        });
      }

      const dataList = passwordRecords.map((record) => ({
        _id: record._id,
        user_id: record.user_id,
        title: record.title,
        username: record.username,
        password: record.password,
        url: record.url,
        note: record.note,
      }));

      return res.status(200).json({
        data: dataList,
      });
    } catch (error) {
      console.error("Error querying data:", error);
      return res.status(500).json({
        message: "Error querying data",
      });
    }
  }

  async showAllDataWithUserId(req, res) {
    try {
      const token = req.params.id; // Lấy user_id từ request params
      const decoded = jwt.verify(token, "thanhyarn");
      const user_id = decoded.userId;
      const passwordRecords = await PasswordRecordModel.find({
        user_id: user_id,
      });

      const newPasswordRecords = passwordRecords.map((item) => {
        const decryptedUsernameBuffer = crypto.privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(item.username, "base64")
        );

        const decryptedUsername = decryptedUsernameBuffer.toString("utf-8");

        // Trả về một đối tượng mới với thông tin giải mã chỉ được thay đổi ở trường username
        return {
          _id: item._id,
          title: item.title,
          createDate: item.createDate,
          username: decryptedUsername,
        };
      });

      res.json(newPasswordRecords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getPasswordRecordById(req, res) {
    console.log("oke ");
    console.log(req.params.id);
    try {
      const passwordRecord = await PasswordRecordModel.findById(req.params.id);

      if (!passwordRecord) {
        return res.status(404).json({
          status: "Failed",
          message: "Password record not found",
        });
      }

      const decryptedUsername = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(passwordRecord.username, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );
      const decryptedUsernameString = decryptedUsername.toString("utf-8");

      const decryptedPassword = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(passwordRecord.password, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );
      const decryptedPasswordString = decryptedPassword.toString("utf-8");

      return res.status(200).json({
        status: "Success",
        data: {
          _id: passwordRecord._id,
          title: passwordRecord.title,
          username: decryptedUsernameString,
          password: decryptedPasswordString,
          url: passwordRecord.url,
          note: passwordRecord.note,
        },
      });
    } catch (error) {
      console.error("Error querying data:", error);
      return res.status(500).json({
        message: "Error querying data",
      });
    }
  }

  async passwordStrengthAnalysis(req, res) {
    console.log("oke ");
    const { password } = req.body;

    // Perform password strength analysis logic here
    // ...

    // Return the analysis result
    return res.status(200).json({
      status: "Success",
      data: {
        strength: "Strong", // Replace with actual analysis result
      },
    });
  }

  async overviewStatistics(req, res) {
    console.log("oke ");
    try {
      const totalRecords = await PasswordRecordModel.countDocuments();
      const strongPasswordCount = await PasswordRecordModel.countDocuments({
        strength: "Strong",
      });
      const weakPasswordCount = await PasswordRecordModel.countDocuments({
        strength: "Weak",
      });

      return res.status(200).json({
        status: "Success",
        data: {
          totalRecords,
          strongPasswordCount,
          weakPasswordCount,
        },
      });
    } catch (error) {
      console.error("Error querying data:", error);
      return res.status(500).json({
        message: "Error querying data",
      });
    }
  }
}

module.exports = new PasswordRecord();
