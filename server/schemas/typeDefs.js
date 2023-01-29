const { gpl } = require("apollo-server-express");
const typeDefs = gpl`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Books] 
  }
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }
  type Auth {
    token: ID!
    user: User
  }
  input BookInput {
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }
`;

module.exports = typeDefs;
