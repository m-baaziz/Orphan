const _ = require('lodash');
const async = require('async');
const createError = require('http-errors');

const { filterPhenotypes } = require('../lib/phenotype');
const { computeDisordersScoreMap, interStatementDisorderScoreUpdate } = require('../lib/disorder');

async function matchDisorders({ statements }) {
  try {
    let disordersMaps = {};
    const scoresMaps = await async.mapSeries(statements, async ({ area, comment }) => {
      try {
        const phenotypes = await filterPhenotypes(area, comment);
        const [scores, disorders] = await computeDisordersScoreMap(phenotypes, comment);
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
    console.log('Error while fetching main phenotypes: ', e);
    return createError(500, 'Error while fetching main phenotypes');
  }
}

module.exports = {
  matchDisorders
};
