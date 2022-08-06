const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Blog = new mongoose.Schema({
    createdby: {
        type: String,
        required: [true, "createdby is required"]
    },
    title: {
        type: String
    },
    blogId: {
        type: String
    },
    description: {
        type: String
    }
}, { timestamps: true });


module.exports = mongoose.model("Blog", Blog);