const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  userId: String,
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
