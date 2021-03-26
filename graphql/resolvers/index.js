const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const passwordStrength = require('pwd-strength');

const User = require('../../models/user');

module.exports = {
    userWatchList: (args) => {
        return User.findOne({email: args.email})
            .then(data => {
                // console.log(data);
                return data.symbols;
            })
            .catch(err => {
                throw err;
            });
    },
    addSymbol: (args, req) => {
        console.log(args.email);
        if (!req.isAuth) {
            throw new Error("User is not authenticated");
        }
        return User.findOne({email: args.email})
            .then(user => {
                if (user == null) {
                    throw new Error("User does not exist");
                }
                else {
                    if (user.symbols.includes(args.symbol.toUpperCase())) {
                        throw new Error(args.symbol + " is already in the watch list");
                    }
                    user.symbols.push(args.symbol.toUpperCase());
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
    deleteSymbol: (args, req) => {
        if (!req.isAuth) {
            throw new Error("User is not authenticated");
        }
        return User.findOne({email: args.email})
            .then(user => {
                if (user == null) {
                    throw new Error("User does not exist");
                }
                else {
                    if (!user.symbols.includes(args.symbol.toUpperCase())) {
                        throw new Error(args.symbol + " is not in the watch list");
                    }
                    user.symbols = user.symbols.filter(symbol => symbol != args.symbol.toUpperCase())
                    return user.save()
                    
                    
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
    signup: (args) => {
        if(args.email === '' && args.password === '' && args.user === '') {
            throw new Error("Enter your credentials to register an account");
        }
        if(args.email === '') {
            throw new Error("Email field is empty");
        }
        if(args.password === '') {
            throw new Error("Password field is empty");
        }
        if(args.user === '') {
            throw new Error("Name field is empty");
        }
        
        // Email validation
        const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!(regex.test(args.email))) {
            throw new Error("Invalid email format");
        }

        if (passwordStrength(args.password).key == 'error') {
            throw new Error("Password invalid: " + passwordStrength(args.password).message);
        }

        return User.findOne({email: args.email})
            .then(user => {
                if (user) {
                    console.log("email exists")
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
    },
    login: async (args) => {
        const user = await User.findOne({email: args.email});
        if ((!user) || (!(await bcrypt.compare(args.password, user.password)))) {
            throw new Error("Login credentials invalid");
        }
        const jwt = jsonwebtoken.sign({email: args.email, userId: user.id}, 'secret', {
            expiresIn: '12h'
        });
        return {userId: user.id, email: args.email, token: jwt, tokenExp: 12, symbols: user.symbols};
    }
};