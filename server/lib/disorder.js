const _ = require('lodash');
const async = require('async');

const Db = require('./Db');
const { computePhenotypeScore } = require('./phenotype');

function findDisorder(orphaNumber) {
  return Db.disorders.findOne({ orphaNumber });
}

function filterDisorders(HPOId) {
  return Db.disorders.find({ 'phenotypes.HPOId': HPOId }).toArray();
}

async function computeDisordersScoreMap(phenotypes, comment) {
  // map of related disorders with associated phenotypes used to find them + scores
  try {
    const scoresMap = {};
    const disordersMap = {};
    const phenotypeWithComment = phenotype => ({ ...phenotype, comment });
    await async.eachSeries(phenotypes, async phenotype => {
      try {
        const disorders = await filterDisorders(phenotype.HPOId);
        disorders.forEach(disorder => {
          const { orphaNumber } = disorder;
          disordersMap[orphaNumber] = disorder;
          scoresMap[orphaNumber] = scoresMap[orphaNumber]
            ? [...scoresMap[orphaNumber], phenotypeWithComment(phenotype)]
            : [];
        });
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return [scoresMap, disordersMap];
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

exports.findDisorder = findDisorder;
exports.filterDisorders = filterDisorders;
exports.computeDisordersScoreMap = computeDisordersScoreMap;
exports.interStatementDisorderScoreUpdate = interStatementDisorderScoreUpdate;
