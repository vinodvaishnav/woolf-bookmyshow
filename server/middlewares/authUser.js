const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    console.log("===== authenticateUser middleware called =====");
    const authHeader = req.headers['authorization'];
    console.log("===== headers =====", req.headers);
    const token = authHeader?.split(" ")[1];
    console.log("===== token =====", token);

    if (!token) {
        res.status(401).send({
            error: 'Access Denied!'
        });

        return;
    }

    try {
        const { user } = jwt.verify(token, process.env.JWT_TOKEN);
        req.body.loggedInUser = user;
        console.log(jwt.verify(token, process.env.JWT_TOKEN));
        console.log("===== user from token =====", user);
        next();
    } catch (err) {
        res.status(401).send({
            error: 'Invalid Token!'
        });
    }
}

module.exports = {
    authenticateUser
}