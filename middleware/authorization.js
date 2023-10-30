// const User = require("../models/index").User

const adminAuthorization = (req, res, next) => {
    const role = req.role;
    
    if (role != "admin") {
        return res.status(401).json({ message: "only admin can access this menu !" });
    } 
    else {
        next()
    };
};

module.exports = {
    adminAuthorization,
};