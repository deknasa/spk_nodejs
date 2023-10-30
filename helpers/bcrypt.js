const bcrypt = require('bcrypt')

function hashedPassword(userPassword) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(userPassword, salt)
    return hash
}

function comparePassword(userPassword, hashedPassword) {
    return bcrypt.compareSync(userPassword, hashedPassword)
}

module.exports = {
    hashedPassword,
    comparePassword
}