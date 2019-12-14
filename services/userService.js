const userModel = require('../models/user')

/**
 *  0 - da xoa
 *  1- active
 */
class UserService {

    constructor() {

    }

    create(user) {
        return userModel.create(user)
    }

    getUserById(id) {
        return userModel.findOne({
            _id: id,
            status: { $eq: 1 }
          });
    }
    getUser(username, password) {
        return userModel.findOne({
            username: username,
            password: password,
            status: { $eq: 1 }
        })
    }

    updatePassword(username, password) {       
        return userModel.update({
            username: username,
            status: { $eq:1}
        }, {
            password: password
        })
    }

    checkUserNameExisted(username) {
        return userModel.exists({
            username: username
        })
    }
}

module.exports = UserService