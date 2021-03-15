const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/user');

const app = express();
const db = require('./config/keys').mongoURI;

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type User {
            _id: ID!
            email: String!
            password: String
            user: String!
            symbols: [String!]!
        }

        type RootQuery {
            userWatchList(user: String!): [String!]!
        }

        type RootMutation {
            addSymbol(user: String!, symbol: String!): User
            addUser(email: String!, password: String!, user: String!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
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
    },
    graphiql: true
}));

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(()=> console.log('Mongo Connected...'))
    .catch(err => console.log(err));

app.listen(3000);