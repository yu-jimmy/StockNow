const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    user: String!
    symbols: [String!]!
    twoFactor: Boolean
    twoFactorSecret: String
    twoFactorSecretAscii: String
}

type AuthData {
    userId: ID!
    email: String!
    token: String!
    tokenExp: Int!
    symbols: [String!]!
    twoFactor: Boolean
    twoFactorSecret: String
    twoFactorSecretAscii: String
}

type RootQuery {
    userWatchList(email: String!): [String!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    addSymbol(email: String!, symbol: String!): User
    deleteSymbol(email: String!, symbol: String!): User
    activateTwoFactor(email: String!, secret: String!, asciiSecret: String!): User
    signup(email: String!, password: String!, user: String!): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);