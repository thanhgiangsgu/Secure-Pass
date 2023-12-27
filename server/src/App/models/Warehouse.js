const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true},
    name: { type: String, required: true },
    password: { type: String, required: true },
});
const Warehouse = mongoose.model("Warehouse", userSchema);

module.exports = Warehouse;