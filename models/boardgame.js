const mongoose = require('mongoose');

const boardgameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  designer: {
    type: String,
    required: true
  },
  publisher: String,
  rating: Number,
  weight: Number,
  category: String,
  description: String,
  expansions: [String]
});

/* 
create our model from the schema to perform CRUD actions on our documents 
 (which are objects created from the model constructor)
*/
const BoardGame = mongoose.model('BoardGame', boardgameSchema);
module.exports = BoardGame;
