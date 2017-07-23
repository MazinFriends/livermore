const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}`, (err) => {
  if (err) {
    console.log(`Mongoose connection error : ${err}`);
  }
});

module.exports = mongoose;
