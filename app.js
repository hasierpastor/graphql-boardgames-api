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
  input UpdateBoardGameInput {
    name: String
    designer: String
    publisher: String
    rating: Float
    weight: Float
    category: String
  }
  type Query {
    allBoardgames: [BoardGame]
    getBoardgame(name: String!): BoardGame!
    totalBoardGames: Int
  }
  type Mutation {
    newBoardGame(input: BoardGameInput!): BoardGame!
    deleteBoardGame(name: String!): BoardGame!
    updateBoardGame(name: String!, input: UpdateBoardGameInput!): BoardGame!
    addExpansion(name: String!, expansion: String!): BoardGame!
  }
`;

/************ RESOLVER FUNCTIONS ************/

//resolver to get the board games in database => will be passed into resolver
const allBoardgames = async () => {
  let boardgames = await BoardGame.find({}).exec();
  return boardgames;
};

//resolver to get a specific board game => search by name
const getBoardgame = async (_, args) => {
  let boardgame = await BoardGame.findOne({ name: args.name }).exec();
  return boardgame;
};

//resolver to get number of board games
const totalBoardGames = async () => {
  let count = await BoardGame.count({});
  return count;
};

//resolver to add a board game to your collection
const newBoardGame = async (_, args) => {
  let newBoardGame = await BoardGame.create({ ...args.input });
  return newBoardGame;
};

//resolver to remove a board game from your collection
const deleteBoardGame = async (_, args) => {
  let removedBoardGame = await BoardGame.findOneAndRemove({
    name: args.name
  }).exec();
  return removedBoardGame;
};

//resolver to update information about a board game
const updateBoardGame = async (_, args) => {
  let query = { name: args.name };
  let update = { ...args.input };
  let boardGame = await BoardGame.findOneAndUpdate(query, update).exec();
  return boardGame;
};

//resolver to add and expansion to a specific board game
const addExpansion = async (_, args) => {
  let boardGame = await BoardGame.findOneAndUpdate(
    { name: args.name },
    { $push: { expansions: args.expansion } }
  ).exec();
  return boardGame;
};

const resolvers = {
  Query: {
    allBoardgames,
    getBoardgame,
    totalBoardGames
  },
  Mutation: {
    newBoardGame,
    deleteBoardGame,
    updateBoardGame,
    addExpansion
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
