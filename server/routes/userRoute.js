const express = require('express');
const { loginUser, registerUser, restPassword, getUserProfile } = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authUser');
const userRouter = express.Router();

// middleware
userRouter.use((req, res, next) => {
    //@TODO: Validate user input -> sanitize input values.
    next();
});

userRouter.get('/profile', authenticateUser, getUserProfile);
userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/reset-password', authenticateUser, restPassword);

module.exports = userRouter;