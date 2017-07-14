const mongoose = require('./db_connection');

const userSchema = new mongoose.Schema({
  id: 'String',
  password: 'String',
  username: 'String',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
