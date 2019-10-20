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

// eslint-disable-next-line no-unused-vars
function computePhenotypeScore(phenotype, text) {
  // should be >= 1
  return 1;
}

exports.findPhenotypesByDirectParent = findPhenotypesByDirectParent;
exports.filterPhenotypes = filterPhenotypes;
exports.computePhenotypeScore = computePhenotypeScore;
