const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Auth = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "userId is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    role: {
        type: String,
        default: 'users',
        enum: ['users', 'staff', 'managers', 'admin']
    },
    fullname: {
        type: String,
        required: [true, "fullname is required"]
    },
    mobile: {
        type: String,
        required: [true, "mobile is required"]
    },
    verified: {
        type: Boolean,
        default: false
    },
    approve: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        required: [true, "gender is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
}, { timestamps: true });

Auth.pre("save", async function(next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

Auth.methods.ComparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("Auth", Auth);