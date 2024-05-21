const mongoose = require('mongoose');

const ListSchema = mongoose.Schema({
  userId: String,
  date: String,
  items: [
    {
      title: String,
      count: Number,
    },
  ],
});

const List = mongoose.model('List', ListSchema);

module.exports = List;
