const bcrypt = require('bcrypt');
const User = require('../models/user');
const { where } = require('sequelize');

const register = async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user) {
            return res.status(400).json({
                error: 'account with username already exists'
            });
        } else if (req.body.password.length < 6) {
            return res.status(400).json({
                error: 'password must be at least 6 characters long'
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }

    bcrypt.hash(req.body.password, 10, (error, cryptPassword) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: cryptPassword
        }).then((registered) => {
            req.session.user = {
                username: registered.username,
                user_id: registered.id
            };
            console.log(req.session);
            res.json({
                message: 'User registered successfully',
                user: registered,
                user_session: req.session.user
            });
        }).catch((error) => {
            res.status(500).json({
                error: error
            });
        });
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
        return res.status(400).json({
            error: 'User does not exist'
        });
    } else if (user) {
        bcrypt.compare(password, user.password, (error, result) => {
            if (result) {
                req.session.user = {
                    username: user,
                    user_id: user.id
                };
                res.json({
                    message: 'User logged in successfully',
                    user: user,
                    user_session: req.session.user
                });
            } else {
                res.status(400).json({
                    error: 'Invalid password'
                });
            }
        });
    }
};

module.exports = {
    register,
    login
}