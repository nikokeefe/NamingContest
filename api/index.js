import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';

let mongoDb;
MongoClient.connect(config.mongodbUri, (error, db) => {
  assert.strict.equal(null, error);

  mongoDb = db;
});

const router = express.Router();

router.get('/contests', (request, response) => {
  const contests = {};
  mongoDb.collection('contests').find({})
    .project({
      id: 1,
      categoryName: 1,
      contestName: 1
    })
    .each((error, contest) => {
      assert.strict.equal(null, error);

      if (!contest) {
        response.send({ contests });
        return;
      }

      contests[contest.id] = contest;
    });
});

router.get('/contests/:contestId', (request, response) => {
  mongoDb.collection('contests')
    .findOne({ id: Number(request.params.contestId) })
    .then(contest => response.send(contest))
    .catch(console.error);
});

router.get('/names/:nameIds', (request, response) => {
  const nameIds = request.params.nameIds.split(',').map(Number);
  const names = {};

  mongoDb.collection('names').find({ id: { $in: nameIds }})
    .each((error, name) => {
      assert.strict.equal(null, error);

      if (!name) {
        response.send({ names });
        return;
      }

      names[name.id] = name;
    });
});

export default router;
