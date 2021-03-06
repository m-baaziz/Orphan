const request = require('request');
const config = require('config');

const Db = require('./Db');

function findPhenotypesByDirectParent(directParent) {
  return Db.phenotypesClassification.find({ directParents: directParent }).toArray();
}

function filterPhenotypes(parentHPOId, text) {
  return Db.phenotypes
    .find({
      parents: parentHPOId,
      $or: [{ name: { $regex: `.*${text}.*` } }, { description: { $regex: `.*${text}.*` } }]
    })
    .toArray();
}

async function fetchPhenotypesWithScore(parentHPOId, statement) {
  const { host, port } = config.get('nlp');
  const { threshold } = config.get('scoring');
  return new Promise((resolve, reject) => {
    request.get(
      `http://${host}:${port}/scores?search=${statement}&parentHPOId=${parentHPOId}&threshold=${threshold}`,
      (error, response, body) => {
        if ((response && response.statusCode !== 200) || error) {
          return reject(error || body);
        }
        try {
          const { scores } = JSON.parse(body);
          return resolve(scores);
        } catch (e) {
          return reject(e);
        }
      }
    );
  });
}

exports.findPhenotypesByDirectParent = findPhenotypesByDirectParent;
exports.filterPhenotypes = filterPhenotypes;
exports.fetchPhenotypesWithScore = fetchPhenotypesWithScore;
