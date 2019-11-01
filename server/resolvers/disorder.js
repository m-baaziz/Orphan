const _ = require('lodash');
const async = require('async');
const createError = require('http-errors');

const { fetchPhenotypesWithScore } = require('../lib/phenotype');
const { computeDisordersScoreMap, interStatementDisorderScoreUpdate } = require('../lib/disorder');

async function matchDisorders({ statements }) {
  try {
    let disordersMaps = {};
    const scoresMaps = await async.mapSeries(statements, async ({ area: parentHPOId, comment }) => {
      try {
        const phenotypesWithScore = await fetchPhenotypesWithScore(parentHPOId, comment);
        console.log('PHENOTYPES WITH SCORE :: ', phenotypesWithScore);
        const [scores, disorders] = await computeDisordersScoreMap(phenotypesWithScore, comment);
        disordersMaps = { ...disordersMaps, ...disorders };
        return scores;
      } catch (e) {
        return Promise.reject(e);
      }
    });

    const disordersScores = scoresMaps.reduce(
      (acc, scoresMap) => _.mergeWith(acc, scoresMap, interStatementDisorderScoreUpdate),
      new Proxy({}, { get: (target, prop) => target[prop] || 1 })
    );

    const sortedDisorders = _.sortBy(Object.keys(disordersScores), [
      orphaNumber => -disordersScores[orphaNumber]
    ]);

    return sortedDisorders.map(orphaNumber => ({
      disorder: disordersMaps[orphaNumber],
      score: disordersScores[orphaNumber]
    }));
  } catch (e) {
    console.log('Error while computing disorders match: ', e);
    return createError(500, `Error while computing disorders match: ${e}`);
  }
}

module.exports = {
  matchDisorders
};
