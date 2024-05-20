const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  userId: String,
  lists: [
    {
      date: String,
      items: [
        {
          title: String,
          count: Number,
        },
      ],
    },
  ],
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
