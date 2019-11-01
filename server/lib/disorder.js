const _ = require('lodash');
const async = require('async');
const config = require('config');

const Db = require('./Db');

function findDisorder(orphaNumber) {
  return Db.disorders.findOne({ orphaNumber });
}

function filterDisorders(HPOId) {
  return Db.disorders.find({ 'phenotypes.HPOId': HPOId }).toArray();
}

async function computeDisordersScoreMap(phenotypesWithScore, comment) {
  // map of related disorders with associated phenotypes used to find them + scores
  try {
    const scoresMap = {};
    const disordersMap = {};
    let { frequency_factors: frequencyFactors } = config.get('scoring');
    frequencyFactors = frequencyFactors.reduce(
      (acc, { label, value }) => ({ ...acc, [label]: value }),
      {}
    );

    await async.eachSeries(phenotypesWithScore, async phenotypeWithScore => {
      try {
        const { HPOId, score } = phenotypeWithScore;
        const disorders = await filterDisorders(HPOId);
        disorders.forEach(disorder => {
          const { orphaNumber } = disorder;
          disordersMap[orphaNumber] = disorder;
          const phenotypeFrequency = _.find(disorder.phenotypes, p => p.HPOId === HPOId).frequency;
          const frequencyRelativeScore = frequencyFactors[phenotypeFrequency] * score;
          scoresMap[orphaNumber] = [
            ...(scoresMap[orphaNumber] || []),
            { HPOId, score: frequencyRelativeScore, comment }
          ];
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
  const incomingScore = _.sum(keyPhenotypes.map(({ score }) => score));
  return lastScore * (incomingScore || 1);
}

exports.findDisorder = findDisorder;
exports.filterDisorders = filterDisorders;
exports.computeDisordersScoreMap = computeDisordersScoreMap;
exports.interStatementDisorderScoreUpdate = interStatementDisorderScoreUpdate;
