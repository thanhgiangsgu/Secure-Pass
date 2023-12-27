const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  createDate: { type: Date, default: Date.now },
  lastLogin: { type: Date},
  // Đặt lại mật khẩu
  passwordResetToken: { type: String }, // Mã đặt lại mật khẩu
  passwordResetExpires: { type: Date }, // Thời gian hết hạn mã đặt lại mật khẩu
  // Số lần đăng nhập thất bại
  loginAttempts: { type: Number, default: 0 },
  // Trạng thái khóa tài khoản
  accountLocked: { type: Boolean, default: false },
  // Thời gian khóa tài khoản (nếu được khóa)
  accountLockExpires: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
