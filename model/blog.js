const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Blog = new mongoose.Schema({
    createdby: {
        type: String,
        required: [true, "createdby is required"]
    },
    text: {
        type: String
    },
    blogId: {
        type: String
    }
}, { timestamps: true });


module.exports = mongoose.model("Blog", Blog);