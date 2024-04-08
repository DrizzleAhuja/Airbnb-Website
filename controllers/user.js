const User = require('../models/user.js')

module.exports.signup = (req, res) => {
    res.render('signup.ejs')
}

module.exports.signup2 = async (req, res, next) => {
    let { username, password, email } = req.body;

    try {
        const user1 = new User({ username, email });
        const user2 = await User.register(user1, password);
        req.login(user2, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Airbnb!!');
            res.redirect('/listings');
        });
    } catch (error) {
        // Check if the error is due to username already taken
        if (error.name === 'UserExistsError') { // Check if it's the specific error name from passport-local-mongoose
            req.flash('error', 'Username already exists');
            return res.redirect('/signup');
        } else {
            // Handle other errors
            return next(error);
        }
    }
};

module.exports.signin = (req, res) => {
    res.render('signin.ejs')
}


module.exports.signin2 = (req, res) => {
    req.flash('success', 'Welcome back to Airbnb!!')
    const s = res.locals.sessionurl || '/listings'
    res.redirect(s)
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Logged Out Successfully!!')
        res.redirect('/listings')
    })
}