const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
    let encryptedPsw = await bcrypt.hash(password, 10);
    return encryptedPsw;
}

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = { encryptPassword, comparePassword };
