const bcrypt = require('bcrypt');

const User = require('../../models/user');

module.exports = {
    userWatchList: (args) => {
        return User.findOne({user: args.user})
            .then(data => {
                console.log(data);
                return data.symbols;
            })
            .catch(err => {
                throw err;
            });
    },
    addSymbol: (args) => {
        return User.findOne({user: args.user})
            .then(user => {
                if (user == null) {
                    throw new Error("User does not exist");
                }
                else {
                    if (user.symbols.includes(args.symbol)) {
                        throw new Error(args.symbol + " is already in the watch list");
                    }
                    user.symbols.push(args.symbol);
                    return user.save();
                }
            })
            .then(result => {
                return { ...result._doc }
            })
            .catch(err => {
                console.log(err);
                throw err;
            })
    },
    addUser: (args) => {
        return User.findOne({email: args.email})
            .then(user => {
                if (user) {
                    throw new Error("User with this email already exists.")
                }
                return bcrypt.genSalt(10)
            })
            .then(salt => {
                return bcrypt.hash(args.password, salt);
            })
            .then(hash => {
                const newUser = new User({
                    email: args.email,
                    password: hash,
                    user: args.user,
                    symbols: []
                });
                return newUser.save()
                    .then(result => {
                        return { ...result._doc, password: null };
                    });
            })
            .catch(err => {
                throw err;
            })
    }
};