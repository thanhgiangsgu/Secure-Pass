const axios = require("axios");

const instance = axios.create({
  baseURL: "http://localhost:3003", // Đặt URL cơ sở của bạn tại đây
  timeout: 10000, // Đặt timeout tối đa (nếu cần)
  // Các cấu hình khác tùy thuộc vào nhu cầu của bạn
});

export default instance;
