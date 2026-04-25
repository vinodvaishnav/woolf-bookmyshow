const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).send({
            error: 'Access Denied!'
        });

        return;
    }

    try {
        const { user } = jwt.verify(token, process.env.JWT_TOKEN);
        req.body.loggedInUser = user;
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