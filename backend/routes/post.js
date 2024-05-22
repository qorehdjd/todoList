const express = require('express');
const Post = require('../models/Post');
const List = require('../models/List');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { dateLists: items, date } = req.body;
    const existList = await List.findOne({ userId: req.user._id, date });
    if (existList && items.length === 0) {
      // 데이터베이스에서 items가 없을때는 삭제 메모리 낭비 방지
      await existList.deleteOne({ _id: existList._id });
      return res.status(200).json({ dateLists: [], date });
    }
    if (existList) {
      existList.items = items;
      existList.save();
      // return res.status(200).json({ dateLists: existList.items, date });
      return res.status(200).json({ dateLists: existList, date });
    }

    const list = await new List({
      userId: req.user._id,
      date,
      items,
    });
    await list.save();
    // return res.status(200).json({ dateLists: list.items, date });
    return res.status(200).json({ dateLists: list, date });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const post = await List.findOne({ userId: req.user._id, date: req.query.date });
    if (!post) {
      return res.status(200).json({ lists: [] });
    }
    return res.status(200).json({ lists: post.items });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
