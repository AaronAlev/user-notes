const express = require('express');
const sequelize = require('./utils/db');
const sessions = require('express-session');

const User = require('./models/user');
User.sync()

const app = express();

app.use(sessions({
    secret: 'noonewillknowthissecret',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});