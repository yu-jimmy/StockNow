const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const checkAuth = require('./authentification/check-auth');

const app = express();
const db = require('./config/keys').mongoURI;

app.use(bodyParser.json());

app.use(checkAuth);

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
}));

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(()=> console.log('Mongo Connected...'))
    .catch(err => console.log(err));

app.listen(4000);