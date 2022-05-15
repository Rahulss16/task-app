const jwt = require("jsonwebtoken");
const User = require("../model/User")

module.exports = async (req, res, next) => {

    try {
        const token = req.header("Authorization").replace('Bearer ', '')
        const decoded = jwt.verify(token, "randomString")
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!token) return res.status(401).json({
            statusCode: 401,
            status: "error",
            message: "Auth Error",
            data: {}
        });
        if (!user) return res.status(401).json({
            statusCode: 401,
            status: "error",
            message: "Auth Error",
            data: {}
        });

        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.error(e);
        res.status(401).json({
            statusCode: 401,
            status: 'error',
            message: "Invalid Token",
            data: {}
        });
    }
};
