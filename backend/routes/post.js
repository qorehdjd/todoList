const express = require('express');
const Post = require('../models/Post');

const router = express();

router.post('/', async (req, res, next) => {
  try {
    console.log('req', req.body);
    const post = await new Post({
      userId: '1561561',
      //   lists: [
      //     {
      //       date: req.body.date,
      //       items: [
      //         {
      //           title: 'good',
      //           count: 5,
      //         },
      //       ],
      //     },
      //   ],
      lists: req.body,
    });
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
