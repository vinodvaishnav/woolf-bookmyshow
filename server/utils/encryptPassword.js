const bcrypt = require('bcrypt');

const encryptPassword = async (password) => {
    let encryptedPsw = await bcrypt.hash(password, 10);
    return encryptedPsw;
}

module.exports = encryptPassword;
