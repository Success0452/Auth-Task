require("dotenv").config()
const Auth = require("../model/auth");
const jwt = require("jsonwebtoken")
const CustomError = require("../errors")

const protect = async(req, res, next) => {
    let token;
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        throw new CustomError.BadRequestError("Invalid authorization format")
    }

    token = auth.split(' ')[1]

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    req.header = await Auth.findById(decode.id).select("-password")

    req.user = {
        userId: req.header.userId,
        role: req.header.role,
    };

    next()
}

const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError(
                'Unauthorized to access this route'
            );
        }
        next();
    };
};

module.exports = {
    protect,
    authorizePermissions
};