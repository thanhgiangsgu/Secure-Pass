const UserModel = require('../models/User'); // Đổi tên biến UserModel
const user = require('../models/User')

class User {
    index(req, res) {
        return res.send("Join to index")
    }

    Test(req, res) {
        let ans = req.params.id;
        console.log(ans);
        console.log("Join to function");
    }

    getUser(req, res) {
        let ans = req.params.id;
        user.findOne({ username: ans }, function (err, userRelative) {
            //handle 
            res.json(userRelative)
            // return check 
        })
    }

    async checkLogin(req, res) {
        console.log(req.body);
        try {
            const accountRelative = await UserModel.findOne({ email: req.body.email });
    
            if (accountRelative && accountRelative.password === req.body.password) {
                return res.json({
                    check: "true"
                });
            }
    
            res.json({
                check: "false"
            });
        } catch (error) {
            console.error("Join to try catch");
            console.error(error);
            res.json({
                check: "false"
            });
        }
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
    
        if (!req.body || !req.body.email) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
    
        const userEmail = req.body.email;
        console.log(userEmail);
    
        // Sử dụng async/await
        try {
            const userRelative = await UserModel.findOne({ email: userEmail });
    
            if (userRelative) {
                return res.json({ check: 'true' });
            } else {
                return res.json({ check: 'false' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    

    async  addUser(req, res) {
        console.log("Join to addUser");
        const { email, name, password, phoneNumber } = req.body;
    
        try {
            const existingUser = await UserModel.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ check: 'false', message: 'Email already exists' });
            }
    
            const newUser = new UserModel({ email, name, password, phoneNumber });
            await newUser.save();
            
            res.status(201).json({
                check: "Success",
                data: {
                    newUser
                }
            });
        } catch (error) {
            res.status(500).json({
                check: 'false',
                message: error.message
            });
        }
    }

    async updateUser(req, res) {
        console.log("Join to updateUser");
        const { email, name, password, phoneNumber } = req.body;
    
        try {
            const existingUser = await UserModel.findOne({ email });
    
            if (!existingUser) {
                return res.status(404).json({
                    status: "Failed",
                    message: "User not found"
                });
            }
    
            // Cập nhật thông tin người dùng nếu dữ liệu được cung cấp
            if (name) {
                existingUser.name = name;
            }
            if (password) {
                existingUser.password = password;
            }
            if (phoneNumber) {
                existingUser.phoneNumber = phoneNumber;
            }
    
            const updatedUser = await existingUser.save();
    
            res.status(200).json({
                status: "Success",
                data: {
                    updateUser: updatedUser
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "Failed",
                message: "Internal server error"
            });
        }
    }
    
    

    async getDataUser(req, res) {
        try {
            const userRelative = await UserModel.find({ id: req.params.id }).exec();
    
            if (!userRelative) {
                return res.status(404).json({
                    status: "Failed",
                    message: "User not found"
                });
            }
    
            res.status(200).json(userRelative);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "Failed",
                message: "Internal server error"
            });
        }
    }
    

    async showAllEmail(req, res) {
        try {
            const users = await UserModel.find({}, '_id email');
    
            if (users.length === 0) {
                return res.status(200).json({
                    message: 'Không có email nào trong cơ sở dữ liệu.'
                });
            };
    
            const emailList = users.map(user => ({
                _id: user._id,
                email: user.email
            }));
    
            return res.status(200).json({
                emails: emailList
            });
        } catch (error) {
            console.error('Lỗi khi truy vấn email:', error);
            return res.status(500).json({
                message: 'Lỗi khi truy vấn email'
            });
        }
    }
    
}

module.exports = new User

