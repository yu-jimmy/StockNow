const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    user: String!
    symbols: [String!]!
}

type AuthData {
    userId: ID!
    email: String!
    token: String!
    tokenExp: Int!
}

type RootQuery {
    userWatchList(user: String!): [String!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    addSymbol(user: String!, symbol: String!): User
    signup(email: String!, password: String!, user: String!): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);