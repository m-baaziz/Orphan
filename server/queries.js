const _ = require('lodash');
const async = require('async');
const { MongoClient } = require('mongodb');
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DISORDERS_COLLECTION,
  PHENOTYPES_COLLECTION,
  DISORDERS_CLASSIFICATION_COLLECTION,
  PHENOTYPES_CLASSIFICATION_COLLECTION
} = require('./config');

let client;
let disordersCollection;
let phenotypesCollection;
let disordersClassificationCollection;
let phenotypesClassificationCollection;

async function initDb() {
  try {
    console.log('initalizing db connection ...');
    client = await MongoClient.connect(`mongodb://${DB_HOST}:${DB_PORT}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    disordersCollection = client.db(DB_NAME).collection(DISORDERS_COLLECTION);
    phenotypesCollection = client.db(DB_NAME).collection(PHENOTYPES_COLLECTION);
    disordersClassificationCollection = client
      .db(DB_NAME)
      .collection(DISORDERS_CLASSIFICATION_COLLECTION);
    phenotypesClassificationCollection = client
      .db(DB_NAME)
      .collection(PHENOTYPES_CLASSIFICATION_COLLECTION);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

function getMainAreas() {
  return phenotypesClassificationCollection.find({ directParents: 'HP:0000118' }).toArray();
}

function findDisorder(orphaNumber) {
  return disordersCollection.findOne({ orphaNumber });
}

function filterPhenotypes(parentHPOId, text) {
  return phenotypesCollection
    .find({
      parents: parentHPOId,
      $or: [{ name: { $regex: `.*${text}.*` } }, { description: { $regex: `.*${text}.*` } }]
    })
    .toArray();
}

function filterDisorders(HPOId) {
  return disordersCollection.find({ 'phenotypes.HPOId': HPOId }).toArray();
}

function computePhenotypeScore(phenotype, text) {
  // should be >= 1
  return 1;
}

async function computeDisordersMap(phenotypes, comment) {
  // map of related disorders with associated phenotypes used to find them + scores
  try {
    const disordersMap = {};
    await async.eachSeries(phenotypes, async phenotype => {
      try {
        const disorders = await filterDisorders(phenotype.HPOId);
        const phenotypeWithComment = phenotype => ({ ...phenotype, comment });
        disorders.forEach(({ orphaNumber }) => {
          disordersMap[orphaNumber] = disordersMap[orphaNumber]
            ? [...disordersMap[orphaNumber], phenotypeWithComment(phenotype)]
            : [];
        });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return disordersMap;
  } catch (e) {
    return Promise.reject(e);
  }
}

function interStatementDisorderScoreUpdate(lastScore, keyPhenotypes) {
  const incomingScore = _.sum(
    keyPhenotypes.map(keyPhenotype => computePhenotypeScore(keyPhenotype, keyPhenotype.comment))
  );
  return lastScore * (incomingScore || 1);
}

async function main() {
  const nameSelector = ({ name }) => name;
  try {
    await initDb();
    const areas = await getMainAreas();
    const areasLabels = areas.map(nameSelector);
    console.log('areas : ', areasLabels);

    const statements = [
      {
        area: areas[0],
        comment: 'dentition'
      },
      {
        area: areas[0],
        comment: 'palate'
      }
    ];

    const disordersMaps = await async.mapSeries(statements, async ({ area, comment }) => {
      try {
        const phenotypes = await filterPhenotypes(area.HPOId, comment);
        return await computeDisordersMap(phenotypes, comment);
      } catch (e) {
        return Promise.reject(e);
      }
    });

    const disordersScores = disordersMaps.reduce(
      (acc, disorderMap) => _.mergeWith(acc, disorderMap, interStatementDisorderScoreUpdate),
      new Proxy({}, { get: (target, prop) => target[prop] || 1 })
    );

    const sortedDisorders = _.sortBy(Object.keys(disordersScores), [
      orphaNumber => -disordersScores[orphaNumber]
    ]);

    const sortedDisordersNames = await async.mapSeries(sortedDisorders, async orphaNumber => {
      try {
        const disorder = await findDisorder(orphaNumber);
        return disorder.name;
      } catch (e) {
        return Promise.reject(e);
      }
    });
    console.log('RESULTS : ', sortedDisordersNames);
    return Promise.resolve();
  } catch (e) {
    console.log('ERROR : ', e);
    return Promise.reject();
  }
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch(e => {
    process.exit(0);
  });
