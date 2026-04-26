const UserModel = require('../models/userModel');
const { encryptPassword, comparePassword } = require('../utils/encryptPassword');
const { generateToken } = require('../utils/authToken');

const validateUserData = (userInput) => {
    return true;
}

const sendRegistrationMail = (user) => {
    return;
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email) {
            throw new Error('Please enter your Email!');
        }
        if (!password) {
            throw new Error('Please enter your Password!');
        }

        let user = await UserModel.findOne({ email: email });
        if (!user) {
            throw new Error('Given email is not registered!!');
        }

        let isValid = await comparePassword(password, user.password);
        if (!isValid) {
            throw new Error('Incorrect email or password!');
        }

        const authToken = generateToken({ user: user._id });

        res.send({
            authToken: authToken
        });
    } catch (err) {
        next(err);
    }
}

const registerUser = async (req, res, next) => {
    const userInput = req.body;
    try {
        // Validate
        validateUserData(userInput);

        // verify the given email if it already exists.
        let user = await UserModel.findOne({ email: userInput.email });
        if (user) {
            throw new Error('Given email is already registered!!');
        }

        // Encrypt the user password
        userInput.password = await encryptPassword(userInput.password);

        // store the user data in DB
        user = new UserModel(userInput);
        await user.save();

        // Send confirmation mail with account activation link.
        sendRegistrationMail();

        res.send({
            message: 'Confirmation mail is sent to your registered email.'
        });
    } catch (err) {
        next(err);
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.loggedInUser;
        const user = await UserModel.findById(userId).select("-password").populate('role', 'name');
        res.send({
            success: true,
            message: "You are Authenticated",
            data: user,
        });
    } catch (err) {
        res.send({
            success: false,
            message: err.message,
        });
    }

    return;
}

const restPassword = (req, res) => {
    res.send({
        success: true,
        message: 'your password has been reset and shared on mail.'
    });
}

module.exports = {
    loginUser,
    registerUser,
    restPassword,
    getUserProfile
}
