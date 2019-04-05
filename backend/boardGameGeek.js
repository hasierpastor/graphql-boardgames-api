const axios = require('axios');
const convert = require('xml-js');
const baseUrl = 'https://www.boardgamegeek.com/xmlapi2';

//function that searches for a board game => will make a call to board game geek api to search for that board game
//will get id and pass it into getBoardGameDetails which will then be passed into the constructBoardGame function
//return input that will be sent to GraphQL so that users can add a new board game to their collection (by searching board game geek)
async function searchBoardGame(name) {
  let params = {
    query: 'brass'
  };
  let result = await axios.get(`${baseUrl}/search`, { params });
  let boardGames = convert.xml2js(result.data, { compact: true, spaces: 4 });
  let id = boardGames.items.item[0]._attributes.id;
  let boardGameInput = await getBoardGameDetails(id);
  console.log(boardGameInput.items.item.name);
  let input = constructBoardGameInput(boardGameInput);
  console.log(input);
  return input;
}

//function that takes in board game id and makes a call to the board game geek api
//function parses xml and returns the board game details
async function getBoardGameDetails(id) {
  let params = {
    id
  };
  let result = await axios.get(`${baseUrl}/thing`, { params });
  result = convert.xml2js(result.data, {
    compact: true,
    spaces: 4
  });
  return result;
}

//function that takes in some parsed board game details and returns a clear, structured object containing certain info
//this object will be used as an input when users want to add board games to their collections
function constructBoardGameInput(boardGame) {
  let input = {};
  let category = searchArray('boardgamecategory', boardGame.items.item.link);
  let designer = searchArray('boardgamedesigner', boardGame.items.item.link);
  let publisher = searchArray('boardgamepublisher', boardGame.items.item.link);
  if (Array.isArray(boardGame.items.item.name)) {
    input.name = boardGame.items.item.name[0]._attributes.value;
  } else {
    input.name = boardGame.items.item.name._attributes.value;
  }
  input.image = boardGame.items.item.image._text;
  input.description = boardGame.items.item.description._text;
  input.category = category;
  input.designer = designer;
  input.publisher = publisher;
  return input;
}

//function that searches for certain info in the nested parsed xml
//will be used to add category, designer and publisher to board game input
//flexible so can add more parameters later => returns first match which should be fine
function searchArray(search, arr) {
  for (let val of arr) {
    if (val._attributes.type === search) {
      return val._attributes.value;
    }
  }
  //if search parameter not found, add this field to board game details
  return `${search} not available for this board game`;
}

console.log(searchBoardGame());
