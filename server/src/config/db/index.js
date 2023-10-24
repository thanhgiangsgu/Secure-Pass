
const mongoose = require('mongoose');

async function connect(){
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    try {
        mongoose.connect('mongodb+srv://khanhdz3612:123@cluster0.akhsnjk.mongodb.net/')
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect }