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
authRoute.route('/verify/account/:id').post(verifyMail)
authRoute.route('/forget/password').post(forgetPassword)
authRoute.route('/verify/password').post(passwordRecovery)
authRoute.route('/approve/managers').post(protect, authorizePermissions('admin'), approveManager)
authRoute.route('/approve/staff').post(protect, authorizePermissions('managers', 'admin'), verifyStaff)
authRoute.route('/add/blog').post(protect, authorizePermissions('admin', 'managers'), addBlog)
authRoute.route('/update/blog').patch(protect, authorizePermissions('admin', 'managers', 'staff'), updateBlog)
authRoute.route('/delete/blog').delete(protect, authorizePermissions('admin', 'managers'), deleteBlog)
authRoute.route('/list/request').get(protect, authorizePermissions('admin', 'managers'), listRequest)
authRoute.route('/list/blog').get(protect, authorizePermissions('admin', 'managers', 'staff', 'users'), listBlog)
authRoute.route('/logout').post(logout)

module.exports = authRoute