const WarehouseModel = require("../models/Warehouse"); // Đổi tên biến UserModel
class Warehouse {
  async addWarehouse(req, res) {
    console.log("oke ");
    const { email, name, password } = req.body;
    try {
      // Tạo một đối tượng nhà kho mới
      const newWarehouse = new WarehouseModel({
        email,
        name,
        password,
      });

      // Lưu đối tượng nhà kho mới vào database
      await newWarehouse.save();

      // Trả về phản hồi thành công
      res.status(201).json({
        check: "Success",
        data: {
          newWarehouse,
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

  async updateWarehouse(req, res) {
    console.log("oke update ");
    const { _id, email, name, password } = req.body;

    try {
      // Tìm kiếm nhà kho hiện có có cùng email
      const existingWarehouse = await WarehouseModel.findByIdAndUpdate(_id, {
        email: email,
        password: password,
        name: name,
      });

      // Trả về phản hồi thành công với thông tin về nhà kho đã cập nhật
      res.status(200).json({
        status: "Success",
        data: {
          existingWarehouse,
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

  async deleteWarehouse(req, res) {
    console.log("oke delete");

    try {
      // Tìm kiếm nhà kho hiện có có cùng email
      const result = await WarehouseModel.findOneAndDelete(req.p);

      if (!result) {
        // Không tìm thấy nhà kho
        res.status(404).json({
          status: "Failed",
          message: "Warehouse not found",
        });
      } else {
        // Nhà kho đã được xóa thành công
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
}

module.exports = new Warehouse();
