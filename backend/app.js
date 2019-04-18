const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { BoardGame } = require('./models');
require('./config');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

//Refactor based on paypal interivew
const typeDefs = gql`
  type BoardGame {
    name: String!
    image: String
    designer: String!
    publisher: String
    rating: Float
    weight: Float
    category: String
    expansions: [String!]
  }
  input BoardGameInput {
    name: String!
    image: String
    designer: String!
    publisher: String
    rating: Float
    weight: Float
    category: String
    expansions: [String!]
  }
  input UpdateBoardGameInput {
    name: String
    image: String
    designer: String
    publisher: String
    rating: Float
    weight: Float
    category: String
  }
  type Query {
    allBoardgames: [BoardGame]
    getBoardgame(name: String): BoardGame!
    totalBoardGames: Int
  }
  type Mutation {
    boardGameNew(input: BoardGameInput!): BoardGame!
    boardGameDelete(name: String!): BoardGame!
    boardGameUpdate(name: String!, input: UpdateBoardGameInput): BoardGame!
    expansionAdd(name: String, expansion: String): BoardGame!
  }
`;

/************ RESOLVER FUNCTIONS ************/

//resolver to get the board games in database => will be passed into resolver

//added names to functions so that they would appear in stack trace (easier to debug)
//also provide function self-reference and self-documenting code

const allBoardgames = async function allBoardgames() {
  let boardgames = await BoardGame.find({}).exec();
  return boardgames;
};

//resolver to get a specific board game => search by name
const getBoardgame = async function getBoardgame(_, args) {
  let boardgame = await BoardGame.findOne({ name: args.name }).exec();
  return boardgame;
};

//resolver to get number of board games
const totalBoardGames = async function totalBoardGames() {
  let count = await BoardGame.count({});
  return count;
};

//resolver to add a board game to your collection
const boardGameNew = async function newBoardGame(_, args) {
  let newBoardGame = await BoardGame.create({ ...args.input });
  return newBoardGame;
};

//resolver to remove a board game from your collection
const boardGameDelete = async function deleteBoardGame(_, args) {
  let removedBoardGame = await BoardGame.findOneAndRemove({
    name: args.name
  }).exec();
  return removedBoardGame;
};

//resolver to update information about a board game
const boardGameUpdate = async function updateBoardGame(_, args) {
  let query = { name: args.name };
  let update = { ...args.input };
  let boardGame = await BoardGame.findOneAndUpdate(query, update).exec();
  return boardGame;
};

//resolver to add and expansion to a specific board game
const expansionAdd = async function addExpansion(_, args) {
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
    boardGameNew,
    boardGameDelete,
    boardGameUpdate,
    expansionAdd
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
