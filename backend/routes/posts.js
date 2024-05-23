const express = require('express');
const List = require('../models/List');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const lists = await List.find({ userId: req.user._id });
    return res.status(200).json(lists);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
