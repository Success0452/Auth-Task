const express = require("express")
const authRoute = express.Router()
const {
    protect,
    authorizePermissions
} = require("../middleware/protect")

const {
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
} = require("../controller/auth")

authRoute.route('/login').post(login)
authRoute.route('/register').post(createAccount)
authRoute.route('/verify/account').post(verifyMail)
authRoute.route('/forget/password').post(forgetPassword)
authRoute.route('/verify/password').post(passwordRecovery)
authRoute.route('/approve/').post(protect, authorizePermissions('admin'), approveManager)
authRoute.route('/verify/staff').post(protect, authorizePermissions('managers'), verifyStaff)
authRoute.route('/add/blog').post(protect, authorizePermissions('admin'), addBlog)
authRoute.route('/update/blog').post(protect, authorizePermissions('admin'), updateBlog)
authRoute.route('/delete/blog').post(protect, authorizePermissions('managers'), deleteBlog)
authRoute.route('/list/request').get(listRequest)
authRoute.route('/list/blog').get(listBlog)
authRoute.route('/logout').post(logout)

module.exports = authRoute