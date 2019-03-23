const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('./config');
const { BoardGame } = require('./models');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type BoardGame {
    name: String!
    designer: String!
    publisher: String
    rating: Float
    weight: Float
    category: String
    expansions: [String!]
  }
  type Query {
    getBoardgames: [BoardGame]
    getBoardgame: BoardGame
    numberBoardGames: Int
  }
  type Mutation {
    addBoardGame(boardgame: BoardGame!): BoardGame
    deleteBoardGame(name: String!): BoardGame
  }
`;

// const scythe = BoardGame.create({
//   name: 'Scythe',
//   designer: 'Jamey Stegmaier',
//   publisher: 'Stonemaier Games',
//   rating: 8,
//   weight: 3.37,
//   category: 'engine builder'
// });

const resolvers = {
  Query: {
    hello: () => 'Hello World!'
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });

// This `listen` method launches a web-server
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
