const axios = require('axios');
const baseUrl = 'https://www.boardgamegeek.com/xmlapi2';
const convert = require('xml-js');

async function searchBoardGame() {
  let params = {
    query: 'scythe'
  };
  let result = await axios.get(`${baseUrl}/search`, { params });
  let boardGames = convert.xml2js(result.data, { compact: true, spaces: 4 });
  let id = boardGames.items.item[0]._attributes.id;
  let boardGameInput = await getBoardGameDetails(id);
  let input = constructBoardGameInput(boardGameInput);
  return input;
}

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

function constructBoardGameInput(boardGame) {
  let input = {};
  let category = searchArray('boardgamecategory', boardGame.items.item.link);
  let designer = searchArray('boardgamedesigner', boardGame.items.item.link);
  let publisher = searchArray('boardgamepublisher', boardGame.items.item.link);
  input.name = boardGame.items.item.name[0]._attributes.value;
  input.description = boardGame.items.item.description._text;
  input.category = category;
  input.designer = designer;
  input.publisher = publisher;
  return input;
}

function searchArray(search, arr) {
  for (let val of arr) {
    if (val._attributes.type === search) {
      return val._attributes.value;
    }
  }
  return `${search} not available for this board game`;
}

console.log(searchBoardGame());
