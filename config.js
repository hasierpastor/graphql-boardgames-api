const mongoose = require('mongoose');
mongoose.set('debug', true); // this will log the mongo queries to the terminal
mongoose.Promise = global.Promise;

// connect to the DB
mongoose
  .connect('mongodb://localhost:27017/boardgame_gql_db')
  .then(() => {
    // once connected, give a success message
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    // if something goes wrong let us know
    console.log(err);
  });
