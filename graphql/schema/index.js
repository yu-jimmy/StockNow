const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
`);