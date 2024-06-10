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

router.get('/monthLists', async (req, res, next) => {
  const { yearAndMonth } = req.query;
  try {
    const lists = await List.find({ userId: req.user._id })
      .where('date')
      .regex(new RegExp(`${yearAndMonth}`));
    const data = lists
      .map((list) => {
        const data = list.items.map((item) => {
          return { title: item.title, count: item.count };
        });
        return data;
      })
      .flat();

    const answer = {};

    for (let key in data) {
      if (answer[data[key].title]) {
        answer[data[key].title] += data[key].count;
      } else {
        answer[data[key].title] = data[key].count;
      }
    }

    const monthLists = [];

    for (let key in answer) {
      monthLists.push({ title: key, count: answer[key] });
    }
    const month = Number(yearAndMonth.split('-')[1]);
    return res.status(200).json({ monthLists, month });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
