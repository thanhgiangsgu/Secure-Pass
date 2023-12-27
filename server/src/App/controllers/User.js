const UserModel = require("../models/User"); // Đổi tên biến UserModel
const AuditLogModal = require("../models/AuditLog");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const fs = require("fs");
const crypto = require("crypto");
const privateKey = fs.readFileSync("./private_key.pem", "utf-8");
const publicKey = fs.readFileSync("./public_key.pem", "utf-8");

class User {
  getUser(req, res) {
    let ans = req.params.id;
    UserModel.findOne({ username: ans }, function (err, userRelative) {
      //handle
      res.json(userRelative);
      // return check
    });
  }

  async checkLogin(req, res) {
    const { email, password } = req.body;

    console.log(email, password);
    // Mã hóa email trước khi tìm kiếm trong cơ sở dữ liệu

    const user = await UserModel.findOne({ email: email });

    let token, refreshToken; // Khai báo biến token ở ngoài phạm vi try/catch

    try {
      if (!user) {
        // Không tìm thấy tài khoản với email này
        return res.json({ message: "Email or password is incorrect" });
      }
      const currentTime = new Date();
      if (user.accountLocked && currentTime < user.accountLockExpires) {
        return res.json({
          message: "Account has been locked. Please try again later.",
        });
      }
      // Giải mã mật khẩu từ cơ sở dữ liệu
      const decryptedPasswordBuffer = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(user.password, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );
      const decryptedPasswordString = decryptedPasswordBuffer.toString("utf-8");

      // Giải mã mật khẩu từ cơ sở dữ liệu
      const decryptedPhoneNumberBuffer = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(user.phoneNumber, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );

      const decryptedDataString = decryptedPhoneNumberBuffer.toString("utf-8");
      console.log(decryptedDataString);
      // So sánh mật khẩu đã băm từ cơ sở dữ liệu với mật khẩu mà người dùng đã gửi
      const passwordMatch = await bcrypt.compare(
        password,
        decryptedPasswordString
      );

      if (passwordMatch) {
        // Mật khẩu khớp, cho phép đăng nhập
        // Tạo JWT token và gán vào biến token
        const payload = { userId: user._id };
        token = jwt.sign(payload, "thanhyarn", { expiresIn: "30m" });
        refreshToken = jwt.sign(payload, "refreshkey");
        user.loginAttempts = 0;
        user.accountLocked = false;
        user.save();
      } else {
        // Mật khẩu không khớp
        user.loginAttempts += 1;
        if (user.loginAttempts > 3) {
          user.accountLocked = true;
          user.accountLockExpires = new Date(Date.now() + 5 * 60 * 1000);
        }
        // Lưu trạng thái của người dùng
        user.save();
        return res.json({ message: "Email or password is incorrect" });
      }
    } catch (error) {
      console.error(error);
      return res.json({ message: "Internal server error" });
    }

    // Trả về token bên ngoài phạm vi try

    const newAuditLog = new AuditLogModal({
      user_id: user._id,
      content: "Login Success",
    });

    await newAuditLog.save();

    return res.json({
      message: "Success",
      token: token, // Gửi token về client
      refreshToken: refreshToken,
    });
  }

  async deleteUser(req, res) {
    console.log("Join to deleteUser");
    try {
      const result = await UserModel.findOneAndDelete({ email: req.params.id });
      if (!result) {
        // Không tìm thấy người dùng
        res.status(404).json({
          status: "failed",
          message: "User not found",
        });
      } else {
        res.status(204).json({
          status: "Success",
          data: {},
        });
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi trong quá trình thực hiện findOneAndDelete()
      res.status(500).json({
        status: "failed",
        message: error.message,
      });
    }
  }

  async checkEmail(req, res) {
    console.log("Join to checkEmail function");

    if (!req.body) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const userEmail = req.body.email;
    console.log(userEmail);

    // Sử dụng async/await
    try {
      const userRelative = await UserModel.findOne({ email: userEmail });

      if (userRelative) {
        return res.json({ check: "true" });
      } else {
        return res.json({ check: "false" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async addUser(req, res) {
    console.log("Join to addUser");
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      twoFactorToken,
      twoFactorEnabled,
      roles,
      emailVerified,
      emailVerificationToken,
      emailVerificationExpires,
      passwordResetToken,
      passwordResetExpires,
    } = req.body;

    const saltRounds = 10;

    //Băm mật khẩu với salt
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const encryptedPassword = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },

      Buffer.from(hashedPassword)
    );

    const encryptedPasswordBase64 = encryptedPassword.toString("base64");

    const encryptedPhoneNumber = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(phoneNumber)
    );
    const encryptedPhoneNumberBase64 = encryptedPhoneNumber.toString("base64");

    try {
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        password: encryptedPasswordBase64,
        phoneNumber: encryptedPhoneNumberBase64,
        twoFactorToken,
        twoFactorEnabled,
        emailVerified,
        emailVerificationToken,
        emailVerificationExpires,
        passwordResetToken,
        passwordResetExpires,
      });

      await newUser.save();

      console.log(newUser);

      res.status(201).json({
        check: "Success",
        data: {
          newUser,
        },
      });
    } catch (error) {
      res.status(500).json({
        check: "false",
        message: error.message,
      });
    }
  }

  async updateUser(req, res) {
    console.log("Join to updateUser");
    const { email, firstName, lastName, phoneNumber } = req.body;

    const errors = [];

    function formatPhoneNumber(phoneNumber) {
      const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ""); // Xóa tất cả ký tự không phải số

      // Kiểm tra chiều dài và định dạng của số điện thoại
      if (
        /^0\d{9}$/.test(cleanedPhoneNumber) ||
        /^0\d{10}$/.test(cleanedPhoneNumber)
      ) {
        // Số điện thoại hợp lệ
        let formattedPhoneNumber = cleanedPhoneNumber;
        if (cleanedPhoneNumber.length === 10) {
          // Định dạng số điện thoại dạng "0xxx xxx xxx"
          formattedPhoneNumber = `0${cleanedPhoneNumber.substring(
            1,
            4
          )} ${cleanedPhoneNumber.substring(
            4,
            7
          )} ${cleanedPhoneNumber.substring(7)}`;
        } else {
          // Định dạng số điện thoại dạng "0xx xxx xxx"
          formattedPhoneNumber = `0${cleanedPhoneNumber.substring(
            1,
            4
          )} ${cleanedPhoneNumber.substring(
            4,
            8
          )} ${cleanedPhoneNumber.substring(8)}`;
        }
        return formattedPhoneNumber;
      } else {
        // Số điện thoại không hợp lệ, thêm thông báo lỗi vào mảng errors
        errors.push("The phone number is not in the correct format");
        return phoneNumber;
      }
    }

    // Kiểm tra firstName và lastName (ví dụ: có ít nhất 2 ký tự)
    if (
      !firstName ||
      !lastName ||
      firstName.length < 1 ||
      lastName.length < 1
    ) {
      errors.push("The name must have at least 1 character");
    }

    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    if (errors.length == 0) {
      try {
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
          return res.status(404).json({
            status: "Failed",
            message: "User not found",
          });
        }

        // Cập nhật thông tin người dùng nếu dữ liệu được cung cấp
        if (firstName) {
          existingUser.firstName = firstName;
        }
        if (lastName) {
          existingUser.lastName = lastName;
        }
        if (phoneNumber) {
          const encryptedPhoneNumber = crypto.publicEncrypt(
            {
              key: publicKey,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            Buffer.from(formattedPhoneNumber)
          );
          const encryptedPhoneNumberBase64 =
            encryptedPhoneNumber.toString("base64");

          existingUser.phoneNumber = encryptedPhoneNumberBase64;
        }

        const updatedUser = await existingUser.save();

        const newAuditLog = new AuditLogModal({
          user_id: updatedUser._id,
          content: "Update Info User",
        });

        await newAuditLog.save();

        res.status(200).json({
          status: "Success",
          data: {
            updateUser: updatedUser,
          },
          errors,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          status: "Failed",
          message: "Internal server error",
        });
      }ne
    } else {
      res.json({ errors });
    }
  }

  async updatePassword(req, res) {
    const { password, newPassword, newConfirmPassword } = req.body;

    const errors = [];

    if (password == newPassword) {
      errors.push("Do not reuse old passwords");
    }
    if (newPassword != newConfirmPassword) {
      errors.push("Passwords do not match");
    }

    // Hàm kiểm tra tính hợp lệ của mật khẩu
    function isPasswordValid(password) {
      // Biểu thức chính quy để kiểm tra mật khẩu có đủ yêu cầu
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
      return passwordRegex.test(password);
    }

    // kiểm tra mật khẩu có đủ yêu cầu hay không , và thêm lỗi vào mảng nếu cần .
    if (!isPasswordValid(newPassword)) {
      errors.push("Password does not meet the requirements");
    }
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    try {
      //Truy vấn cơ sở dữ liệu để lấy mật khẩu đã băm bằng email
      const user = await UserModel.findById(user_id);
      if (!user) {
        // Không tìm thấy tài khoản với _id này
        return res.status(401).json({ message: "Không tồn tại " });
      }
      // Giải mã mật khẩu từ cơ sở dữ liệu
      const decryptedPasswordBuffer = crypto.privateDecrypt(
        {
          key: privateKey, // Sử dụng khóa riêng tư để giải mã
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(user.password, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
      );
      const decryptedPasswordString = decryptedPasswordBuffer.toString("utf-8");
      // So sánh mật khẩu đã băm từ cơ sở dữ liệu với mật khẩu mà người dùng đã gửi

      const passwordMatch = await bcrypt.compare(
        password,
        decryptedPasswordString
      );

      if (passwordMatch) {
        if (errors.length == 0) {
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          const encryptedPassword = crypto.publicEncrypt(
            {
              key: publicKey,
              padding: crypto.constants.RSA_PKCS1_PADDING,
            },

            Buffer.from(hashedPassword)
          );
          const encryptedPasswordBase64 = encryptedPassword.toString("base64");

          const updatedUser = await UserModel.findByIdAndUpdate(
            user_id,
            { password: encryptedPasswordBase64 },
            { new: true }
          );

          const newAuditLog = new AuditLogModal({
            user_id: updatedUser._id,
            content: "Change Password Success",
          });

          await newAuditLog.save();
          return res.status(200).json({
            message: "Password changed successfully",
            errors,
          });
        }
        console.log(errors);
        return res.json({ errors });
      } else {
        errors.push("Password incorrect");
        console.log(errors);
        return res.json({ errors });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getDataUser(req, res) {
    const token = req.params.id;
    const decoded = jwt.verify(token, "thanhyarn");
    const user_id = decoded.userId;

    console.log(user_id);
    UserModel.findById(user_id)
      .then((userRelative) => {
        if (!userRelative) {
          return res.status(404).json({ message: "User not found" });
        }
        const decryptedPhoneNumberBuffer = crypto.privateDecrypt(
          {
            key: privateKey, // Sử dụng khóa riêng tư để giải mã
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(userRelative.phoneNumber, "base64") // Lấy giá trị đã được mã hóa từ cơ sở dữ liệu
        );
        const decryptedPhoneNumber =
          decryptedPhoneNumberBuffer.toString("utf-8");

        userRelative.phoneNumber = decryptedPhoneNumber;
        res.json(userRelative);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      });
  }

  async showAllEmail(req, res) {
    try {
      const users = await UserModel.find({}, "_id email");

      if (users.length === 0) {
        return res.status(200).json({
          message: "There are no emails in the database.",
        });
      }

      const emailList = users.map((user) => ({
        _id: user._id,
        email: user.email,
      }));

      return res.status(200).json({
        emails: emailList,
      });
    } catch (error) {
      console.error("Lỗi khi truy vấn email:", error);
      return res.status(500).json({
        message: "Error while querying email",
      });
    }
  }

  async register(req, res) {
    const errors = [];
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    if (password != confirmPassword) {
      errors.push("Password incorrect");
    }

    async function isEmailUnique(email) {
      try {
        const userRelative = await UserModel.findOne({ email: email });
        if (userRelative) {
          return false;
        } else {
          return true;
        }
      } catch (err) {
        console.log("Vào lỗi");
        console.error(err);
      }
    }

    // Hàm kiểm tra tính hợp lệ của mật khẩu
    function isPasswordValid(password) {
      // Biểu thức chính quy để kiểm tra mật khẩu có đủ yêu cầu
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
      return passwordRegex.test(password);
    }

    // Kiểm tra email đã tồn tại hay chưa

    console.log("Kiểm tra : ", isEmailUnique(email));

    const emailIsUnique = await isEmailUnique(email);
    if (!emailIsUnique) {
      errors.push("Email đã tồn tại");
    }

    // Kiểm tra password và password confirm có trùng khớp hay không

    // kiểm tra mật khẩu có đủ yêu cầu hay không , và thêm lỗi vào mảng nếu cần .
    if (!isPasswordValid(password)) {
      errors.push("Password does not meet the requirements");
    }

    // Kiểm tra firstName và lastName (ví dụ: có ít nhất 2 ký tự)
    if (
      !firstName ||
      !lastName ||
      firstName.length < 1 ||
      lastName.length < 1
    ) {
      errors.push("The name must have at least 1 character");
    }

    function isEmailValid(email) {
      // Sử dụng biểu thức chính quy để kiểm tra định dạng email
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    }

    // Sử dụng hàm isEmailValid trong hàm register
    if (!isEmailValid(email)) {
      // Email không hợp lệ, xử lý lỗi tại đây
      errors.push("Email does not comply with regulations");
    }

    console.log(errors);
    // Nếu có lỗi, trả về tất cả lỗi cho client.
    return res.json({ errors });
  }

  verifyToken(req, res) {
    // Lấy token từ tiêu đề Authorization
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    let responseSent = false;

    // Kiểm tra tính hợp lệ và thời gian hết hạn của token
    jwt.verify(token.split(" ")[1], "thanhyarn", (err, decoded) => {
      if (err) {
        if (!responseSent) {
          // Chưa gửi phản hồi, gửi phản hồi lỗi
          res.status(401).json({ message: "Invalid token" });
          responseSent = true;
        }
      } else {
        // Kiểm tra thời gian hết hạn của token
        const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại dưới dạng giây

        if (decoded.exp && decoded.exp < currentTime) {
          // Token đã hết hạn
          res.status(401).json({ message: "Token has expired" });
          responseSent = true;
        } else {
          // Token hợp lệ, tiếp tục xử lý
          req.decoded = decoded;

          if (!responseSent) {
            // Gửi phản hồi thành công nếu chưa gửi
            res.status(200).json({ message: "Token is valid" });
            responseSent = true;
          }
        }
      }
    });
  }

  refreshToken(req, res) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is missing" });
    }

    jwt.verify(refreshToken, "refreshkey", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Tạo một token mới và gửi về cho client
      const newToken = jwt.sign({ userId: decoded.userId }, "thanhyarn", {
        expiresIn: "30m",
      });

      res.json({ token: newToken });
    });
  }

  async sendCode(req, res) {
    console.log("Join to forgetPassword");
    const email = req.body.email;
    function generateRandomCode() {
      const min = 0;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const code = randomNumber.toString().padStart(6, "0"); // Đảm bảo chuỗi ít nhất 6 chữ số
      return code;
    }

    const code = generateRandomCode();
    const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 phút
    await UserModel.findOneAndUpdate(
      { email: email },
      {
        passwordResetToken: code,
        passwordResetExpires: expirationTime,
      }
    );

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
      subject: "Sending Email using nodejs",
      text: code,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Success" });
      }
    });
  }

  async checkCode(req, res) {
    const { email, code } = req.body;
    console.log(email, code);

    try {
      const userRelative = await UserModel.findOne({ email: email });

      // Kiểm tra xem người dùng có tồn tại trong database hay không
      if (!userRelative) {
        return res.json({ message: "User does not exist" });
      }

      // Kiểm tra xem mã code có chính xác trong database hay không
      if (userRelative.passwordResetToken !== code) {
        return res.json({ message: "Invalid code" });
      }

      // Kiểm tra xem thời gian hiện tại có vượt quá thời gian trong database hay không
      const currentTime = new Date();
      if (currentTime > userRelative.passwordResetExpires) {
        return res.json({ message: "The code has expired" });
      }

      // Nếu tất cả đều đúng, tạo token dựa trên email
      const token = jwt.sign({ email: email }, "thanhyarn", {
        expiresIn: "3m",
      });

      // Gửi token về cho client
      return res.json({ message: "Success", token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async resetPassword(req, res) {
    // Hàm giải mã token và kiểm tra thời gian hết hạn
    function getInfoFromToken(token) {
      try {
        const decoded = jwt.verify(token, "thanhyarn");

        // Kiểm tra thời gian hết hạn (expiration time)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          console.error("Token hết hạn.");
          return null;
        }

        return decoded;
      } catch (error) {
        // Xử lý lỗi khi token không hợp lệ
        console.error("Invalid token:", error);
        return null;
      }
    }

    try {
      const { password, confirmPassword, token } = req.body;
      // Kiểm tra sự trùng khớp của mật khẩu
      console.log(password, confirmPassword);
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      // Giải mã token để lấy thông tin
      const decodedInfo = getInfoFromToken(token);

      // Kiểm tra xem token có hợp lệ không
      if (!decodedInfo || !decodedInfo.email) {
        return res.status(400).json({ error: "Invalid token" });
      }

      const email = decodedInfo.email;

      try {
        const user = await UserModel.findOne({ email });
        // Nếu người dùng không tồn tại , xử lý theo cách phù hợp với ứng dụng
        if (!user) {
          throw new Error("User does not exist");
        }
        // Băm mật khẩu mới trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(password, 10);

        const encryptedPassword = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(hashedPassword)
        );
        const encryptedPhoneNumberBase64 = encryptedPassword.toString("base64");
        // Cập nhật mật khẩu mới cho người dùng
        user.password = encryptedPhoneNumberBase64;
        await user.save();

        const newAuditLog = new AuditLogModal({
          user_id: user._id,
          content: "Login Success",
        });

        await newAuditLog.save();
        return res.status(200).json({ message: "Success" });
      } catch (error) {
        throw new Error(
          `Lỗi khi cập nhật mật khẩu trong cơ sở dữ liệu: ${error.message}`
        );
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      return res.status(500).json({ error: "Đã xảy ra lỗi khi đổi mật khẩu." });
    }
  }
}

module.exports = new User();
