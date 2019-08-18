import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
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
      categoryName: 1,
      contestName: 1
    })
    .each((error, contest) => {
      assert.strict.equal(null, error);

      if (!contest) {
        response.send({ contests });
        return;
      }

      contests[contest._id] = contest;
    });
});

router.get('/names/:nameIds', (request, response) => {
  const nameIds = request.params.nameIds.split(',').map(ObjectID);
  const names = {};

  mongoDb.collection('names').find({ _id: { $in: nameIds } })
    .each((error, name) => {
      assert.strict.equal(null, error);

      if (!name) {
        response.send({ names });
        return;
      }

      names[name._id] = name;
    });
});

router.get('/contests/:contestId', (request, response) => {
  mongoDb.collection('contests')
    .findOne({ _id: ObjectID(request.params.contestId) })
    .then(contest => response.send(contest))
    .catch(error => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

router.post('/names', (request, response) => {
  const contestId = ObjectID(request.body.contestId);
  const name = request.body.newName;
  // Validate inputs here

  mongoDb.collection('names').insertOne({ name })
    .then(result => mongoDb.collection('contests').findAndModify(
      { _id: contestId },
      [],
      { $push: { nameIds: result.insertedId } },
      { new: true })
      .then(doc => response.send({
        updatedContest: doc.value,
        newName: { _id: result.insertedId, name }
      }))
    )
    .catch(error => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

export default router;
