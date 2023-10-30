const jwt = require("jsonwebtoken")
const secretKey = "secret";

const verify = (req, res, next) => {
    const token = req.headers["authentication"];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                msg: err.message
            });
        }
        req.id = decoded.id;
        req.role = decoded.role;
        next();
    });
};

const generateToken = (payload) => {
    const token = jwt.sign(payload, secretKey, {
        algorithm: "HS256",
        expiresIn: "1H",
    });
    return token;
};

const destroyToken = (payload) => {
    // const token = jwt.des
    const authHeader = req.headers["authentication"];
    jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
        res.send({msg : 'You have been Logged Out' });
        } else {
        res.send({msg:'Error'});
        }
    })
}

module.exports = {
    verify,
    generateToken,
    destroyToken
};