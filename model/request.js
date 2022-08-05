const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Request = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "userId is required"]
    },
    role: {
        type: String
    }
}, { timestamps: true });


module.exports = mongoose.model("Request", Request);