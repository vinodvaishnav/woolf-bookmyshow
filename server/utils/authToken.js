const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const authToken = jwt.sign(user, process.env.JWT_TOKEN, { expiresIn: "15m" });
    return authToken;
}

module.exports = { generateToken };