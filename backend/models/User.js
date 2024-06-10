const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    maxLength: 10,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  nickname: {
    type: String,
    required: true,
    maxLength: 10,
  },
  subscriptionPeriod: Date,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
