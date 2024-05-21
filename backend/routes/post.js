const express = require('express');
const Post = require('../models/Post');
const List = require('../models/List');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { dateLists: items, date } = req.body;
    const existList = await List.findOne({ userId: req.user._id, date });
    console.log('existList', existList);
    if (existList) {
      existList.items = items;
      existList.save();
      return res.status(200).json({ dateLists: existList.items, date });
    }

    const list = await new List({
      userId: req.user._id,
      date,
      items,
    });
    console.log('ppppost', list);
    await list.save();
    return res.status(200).json({ dateLists: list.items, date });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const post = await List.findOne({ userId: req.user._id, date: req.query.date });
    console.log('pppoost', post);
    if (!post) {
      return res.status(200).json({ lists: [] });
    }
    // const lists = post?.lists.find((list) => list.date === req.query.date);
    return res.status(200).json({ lists: post.items });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
