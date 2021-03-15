const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const WatchList = require('./models/watchList');
const User = require('./models/user');

const app = express();
const db = require('./config/keys').mongoURI;

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type WatchList {
            _id: ID!
            user: String!
            symbols: [String!]!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            user: String!
            watchlist: WatchList!
        }

        type RootQuery {
            watchList(user: String!): WatchList!
        }

        type RootMutation {
            addSymbol(user: String!, symbol: String!): WatchList
            addUser(email: String!, password: String!, user: String!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        watchList: (args) => {
            return WatchList.findOne({user: args.user}).populate('creator')
                .then(data => {
                    console.log(data);
                    return data;
                })
                .catch(err => {
                    throw err;
                });
        },
        addSymbol: (args) => {
            return WatchList.findOne({user: args.user})
                .then(list => {
                    if (list == null) {
                        throw new Error("User is not recognized");
                    }
                    else {
                        if (list.symbols.includes(args.symbol)) {
                            throw new Error(args.symbol + " is already in the watch list");
                        }
                        list.symbols.push(args.symbol);
                        return list.save();
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
            let createdUser;
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
                        user: args.user
                    });
                    return newUser.save()
                        .then(result => {
                            createdUser = { ...result._doc, password: null };
                            const newWatchList = new WatchList({user:args.user, symbols:[], creator: newUser});
                            return newWatchList.save()
                                .then(list => {
                                    if (!list) throw new Error("WatchList does not exist"); 
                                    return User.findOne({email: args.email, user: args.user})
                                        .then(user => {
                                            user.watchlist = newWatchList;
                                            user.save();
                                        })
                                        .then(result => {
                                            return createdUser;
                                        })
                                });
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