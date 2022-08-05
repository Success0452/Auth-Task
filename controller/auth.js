const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("../errors");
const bcrypt = require("bcryptjs")
const Auth = require("../model/auth");
const Blog = require("../model/blog");
const Request = require("../model/request");
const mailer = require("../util/mailer");
const generateToken = require("../util/generate_token");
const { response } = require("express");


const createAccount = async(req, res) => {
    const { email, fullname, mobile, gender, password, role } = req.body

    const userId = `authId${Math.floor(1000 + Math.random() * 9000)}`;

    const find = await Auth.findOne({ email });

    if (find) {
        throw new CustomApiError.BadRequestError("email is already a user")
    }

    // first registered user is an admin
    const isFirstAccount = (await Auth.countDocuments({})) === 0;
    const first = isFirstAccount ? 'admin' : role;

    const user = new Auth({
        userId: userId,
        email: email,
        fullname: fullname,
        mobile: mobile,
        gender: gender,
        password: password,
        role: first
    })

    if (first === 'users') {
        user.save(function(err, result) {
            if (err) throw new CustomApiError.BadRequestError("unable to process request")
            sendVerificationLink(result, res)
        })
    }
    if (first === "admin") {
        user.save(function(err, result) {
            if (err) throw new CustomApiError.BadRequestError("unable to process request")
            sendVerificationLink(result, res)
        })
    }
    if (first === "managers" || first === "staff") {
        res.status(StatusCodes.ACCEPTED).json({
            msg: `your application is been processed`,
            success: true
        });
        user.save()
        await Request.create({ userId: userId, role: first })
    }

}

const approveManager = async(req, res) => {
    const find = await Auth.findOne({ userId: req.header.userId, role: 'admin' })

    if (!find) {
        throw new CustomApiError.UnauthorizedError("you dont have access to this function")
    }

    const { userId } = req.body

    const request = await Request.findOne({ userId: userId })

    if (!request) {
        throw new CustomApiError.NotFoundError("request cannot be found")
    }

    const user = await Auth.findOne({ userId: userId, role: 'managers' || 'admin' })

    if (!user) {
        throw new CustomApiError.NotFoundError("user cannot be found")
    }

    await Auth.updateOne({ userId: userId }, { approve: true, verified: true })
    await Request.deleteOne({ userId: userId })
    res.status(StatusCodes.ACCEPTED).json({
        msg: "user approved",
        success: true
    });
}

const verifyStaff = async(req, res) => {
    const find = await Auth.findOne({ userId: req.header.userId, role: 'admin' })

    const manager = await Auth.findOne({ userId: req.header.userId, role: 'managers' })

    if (!admin || !manager) {
        throw new CustomApiError.UnauthorizedError("you dont have access to this function")
    }

    const { userId } = req.body

    const user = await Auth.findOne({ userId: userId, role: 'staff' })

    if (!user) {
        throw new CustomApiError.NotFoundError("user cannot be found")
    }

    await Auth.updateOne({ userId: user.userId, role: 'staff' }, { approve: true, verified: true })

    res.status(StatusCodes.ACCEPTED).json({
        msg: "user approved as a staff",
        success: true
    });
}

const sendVerificationLink = async({ userId, email, role }, res) => {

    if (!userId || !email) {
        throw new CustomApiError.NotFoundError("email and id or found")
    }

    const admin = `<p>Welcome to auth app, you are the admin of this app
    and you have roles of verifying staff and managers, do well to validate
    your account with this link and explore. 
    <p>localhost:3000/api/v1/account/v/${userId}</p></p>`
    const users = `<p>Welcome to auth app, we are thrilled to have you onboard, 
    to better serve you, we will like you to verify your account 
    by clicking the link below. <p>localhost:3000/api/v1/account/v/${userId}</p></p>`

    const msg = role === 'admin' ? admin : users

    mailer.SendMail(
        email,
        "Confirm Your Account",
        msg
    )

    res.status(StatusCodes.ACCEPTED).json({
        msg: `verification mail sent to ${email}`,
        success: true
    });
}

const verifyMail = async(req, res) => {
    const { id } = req.params

    const find = await Auth.findOne({ userId: id });

    if (!find) {
        throw new CustomApiError.BadRequestError("unable to access account")
    }

    await Auth.updateOne({ userId: find.userId }, { verified: true, approve: true })

    res.status(StatusCodes.OK).json({
        msg: `email verified, procced to login`,
        success: true
    });
}

const login = async(req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        const err = "id and password are required"
        return res.render('../views/pages/login', { err: err })
            // throw new CustomApiError.BadRequestError("id and password are required")
    }

    const user = await Auth.findOne({ email: email });

    if (!user) {
        const err = "unable to locate user"
        return res.render('../views/pages/login', { err: err })
            // throw new CustomApiError.NotFoundError("unable to locate user")
    }

    const verify = await user.ComparePassword(password)

    if (!verify) {
        const err = "unable to verify password"
        return res.render('../views/pages/login', { err: err })
            // throw new CustomApiError.UnauthenticatedError("unable to verify password")
    }

    if (user.verified === false) {
        // throw new CustomApiError.UnauthenticatedError("user is not verified, check your email")
        const err = "user is not verified, check your email"
        return res.render('../views/pages/login', { err: err })
    }

    const show = await Auth.findOne({ email: email }).select("-password").select("-__v");
    // res.status(StatusCodes.ACCEPTED).json({
    //     msg: "account logged in",
    //     success: true,
    //     user: show,
    //     token: generateToken(user.userId)
    // })
    // res.status(StatusCodes.ACCEPTED).redirect('/home')
    res.render('../views/pages/home', { user: show })
}

const forgetPassword = async(req, res) => {
    const { email } = req.body

    const user = await Auth.findOne({ email: email });

    if (!user) {
        throw new CustomApiError.NotFoundError("unable to locate user")
    }

    sendPasswordLink(user.userId, user.email, res)

}

const sendPasswordLink = async(userId, email, res) => {

    if (!_id || !email) {
        throw new CustomApiError.NotFoundError("email and id or found")
    }

    mailer.SendMail(
        email,
        "Password Recovery",
        `<p>Plase use the link provided below to change your password, ignore if you didn't initiate this process.
         <p>localhost:3000/api/v1/password/c/${userId}</p></p>`
    )

    res.status(StatusCodes.ACCEPTED).json({
        msg: `password recovery mail sent to ${email}`,
        success: true
    });
}


const passwordRecovery = async(req, res) => {
    const { id } = req.params

    const { newPassword, confirmPassword } = req.body

    const find = await Auth.findOne({ userId: id });

    if (!find) {
        throw new CustomApiError.BadRequestError("unable to access account")
    }

    if (newPassword === !confirmPassword) {
        throw new CustomApiError.BadRequestError("password does not match")
    }

    const salt = await bcrypt.genSalt(10)
    hashPassword = await bcrypt.hash(newPassword, salt)

    await Auth.updateOne({ userId: find.userId }, { password: hashPassword })

    res.status(StatusCodes.OK).json({
        msg: `password changed successfully`,
        success: true
    });
}

const addBlog = async(req, res) => {
    const admin = await Auth.findOne({ userId: req.header.userId, role: 'admin' || 'managers' })

    if (!admin) {
        throw new CustomApiError.UnauthorizedError("you dont have access to this function")
    }
    const blogId = `authId${Math.floor(1000 + Math.random() * 9000)}`;


    const { text } = req.body
    const blog = new Blog({
        blogId: blogId,
        createdby: admin,
        text: text,
    })

    blog.save()

    res.status(StatusCodes.ACCEPTED).json({
        msg: "blog created successfully",
        success: true
    });

}

const updateBlog = async(req, res) => {
    const admin = await Auth.findOne({ userId: req.header.userId, role: 'admin' || 'managers' || 'staff' })

    if (!admin) {
        throw new CustomApiError.UnauthorizedError("you dont have access to this function")
    }

    const { text, blogId } = req.body

    const blog = await Blog.updateOne({ blogId: blogId }, { text: text })


    res.status(StatusCodes.ACCEPTED).json({
        msg: "blog updated successfully",
        success: true
    });
}

const deleteBlog = async(req, res) => {
    const admin = await Auth.findOne({ userId: req.header.userId, role: 'admin' || 'managers' })

    if (!admin) {
        throw new CustomApiError.UnauthorizedError("you dont have access to this function")
    }

    const { blogId } = req.body

    const blog = await Blog.deleteOne({ blogId: blogId })

    res.status(StatusCodes.ACCEPTED).json({
        msg: "blog deleted successfully",
        success: true
    });
}

const listRequest = async(req, res) => {
    const request = await Request.find()

    res.status(StatusCodes.ACCEPTED).json(request)
}

const listBlog = async(req, res) => {
    const blog = await Blog.find()

    res.status(StatusCodes.ACCEPTED).json(blog)
}

const logout = async(req, res) => {

}

module.exports = {
    createAccount,
    verifyMail,
    login,
    forgetPassword,
    passwordRecovery,
    approveManager,
    verifyStaff,
    addBlog,
    updateBlog,
    deleteBlog,
    listRequest,
    listBlog,
    logout
}