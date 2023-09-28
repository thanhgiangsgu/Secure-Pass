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

    checkLogin(req, res) {
        console.log(req.body);
        user.findOne({email: req.body.email})
            .then((accountRelative) => {
                try {
                    console.log("Join to try catch");
                    console.log(req.body.password);
                    if (accountRelative && accountRelative.password == req.body.password) {
                        return res.json({
                            accountRelative
                        });
                    }
                    res.json({
                        check: "false"
                    });
                } catch (error) {
                    console.log(error);
                    res.json({
                        check: "false"
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                res.json({
                    check: "false"
                });
            });
    }
    

    async deleteUser(req, res) {
        console.log("Join to deleteUser");
        await user.findOneAndDelete({ email: req.params.id })
        try {
            res.status(204).json({
                status: "Success",
                data: {},
            })
        } catch (error) {
            res.status(500).json({
                status: "failed",
                message: err
            })
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
            const userRelative = await user.findOne({ email: userEmail });
            if (!userRelative) {
                return res.json({ check: 'false' });
            } else {
                return res.json({ check: 'true' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    addUser(req, res) {
        console.log("Join to addUser");
        const dataUser = new user(req.body);
        try {
            dataUser.save()
            res.status(201).json({
                check: "Success",
                data: {
                    dataUser
                }
            })
        } catch (error) {
            res.status(500).json({
                check: 'false',
                message: error
            })
        }
    }

    async updateUser(req, res) {
        console.log("Join to updateUser");
        const updateUser = await user.findOneAndUpdate(
            { email: req.body.email }, req.body, { new: true }
        )
        try {
            res.status(200).json({
                status: "Success",
                data: {
                    updateUser
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    getDataUser(req, res) {
        user.find({ email: req.params.id }, function (err, userRelative) {
            res.json(userRelative)
        })
    }

    async showAllEmail(){
        try {
            const users = await user.find({}, 'email'); // Truy vấn tất cả các bản ghi và chỉ lấy trường 'email'
            
            if (users.length === 0) {
                console.log('Không có email nào trong cơ sở dữ liệu.');
                return;
            }
    
            console.log('Danh sách các email:');
            users.forEach((user) => {
                console.log(user.email);
            });
        } catch (error) {
            console.error('Lỗi khi truy vấn email:', error);
        }
    }
}

module.exports = new User

