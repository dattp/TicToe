const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const UserService = require('../services/userService')
const UserController = require('../controllers/userController')

const userController = new UserController()
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (id, cb) {
    userController.getUserById(id).then((user) => {
        cb(null, user);
    }).catch(err => {
        cb(err);
    })
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},

    async function (req, username, password, done) {
        console.log('=====>action: ', req.body.action);
        console.log('=====>password1: ', password);
        let userLogin = await userController.checkUserLogin(username, password, req.body.action)
        // console.log('=====>userLogin: ', userLogin);
        if (userLogin.error) {
            return done(null, false, 
                req.flash('message', userLogin.error));    
        }
        return done(null, userLogin.data)
    }
));

module.exports = function configPassport(app) {

    app.use(passport.initialize());
    app.use(passport.session());
    // app.get('/tables/getlist', (req, res) => res.render('board_game', {username: req.session.passport.user.username}));
    app.get('/error', (req, res) => res.render('index', { error: req.flash('message') }));
    app.post('/',
        passport.authenticate('local', {
            successRedirect: '/tables/getlist',
            failureRedirect: '/error',
            failureFlash: true
        }))
}