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
  input BoardGameInput {
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
    getBoardgame(name: String!): BoardGame
    numberBoardGames: Int
  }
  type Mutation {
    addBoardGame(input: BoardGameInput!): BoardGame
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

//function to get the boardgames in database => will be passed into resolver
const getBoardgames = async () => {
  let boardgames = await BoardGame.find({}).exec();
  return boardgames;
};

const getBoardgame = async (_, args) => {
  let boardgame = await BoardGame.findOne({ name: args.name }).exec();
  return boardgame;
};

const numberBoardGames = async () => {
  let count = await BoardGame.count({});
  return count;
};

const addBoardGame = async (_, args) => {
  let newBoardGame = await BoardGame.create({ ...args.input });
  return newBoardGame;
};

const resolvers = {
  Query: {
    getBoardgames,
    getBoardgame,
    numberBoardGames
  },
  Mutation: {
    addBoardGame
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
