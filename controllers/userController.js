const _ = require('lodash')
const UserService = require('../services/userService')
const userService = new UserService()

class UserController {
    constructor(){
        //TODO:
    }

    async checkUserLogin(username, password, action) {
        let output = {
            error: null,
            data: null
        }
        try {
            let userLogin = await userService.checkUserNameExisted(username)
            // neu user signup ma da ton tai username roi
            if (action === 'signup' && userLogin){
                output.error = 'UserName existed!'
                return output
            }
            if (action === 'signup' && !userLogin){
                // create user
                output.data = await userService.create({
                    username : username, 
                    password : password, 
                    status: 1,
                    point: 0
                })
                return output
            }
            let user = await userService.getUser(username, password)
            if (!user) {
                output.error = 'Sai username hoac pass'
                return output
            }
            output.data = user
            return output
        } catch (error) {
            console.log(error);
            output.error = 'Loi he thong'
            return output
        }
    }

    getUserById(id){
        try {
            if (_.isEmpty(id)) {
                return null
            }
            return userService.getUserById(id)
        } catch (error) {
            console.log(error);
            return null
        }
    }
}

module.exports = UserController