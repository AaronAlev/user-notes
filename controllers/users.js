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

module.exports = {
    register
}