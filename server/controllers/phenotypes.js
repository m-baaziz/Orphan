const Db = require('../lib/Db');

async function findParentPhenotypes(req, res) {
  try {
    const phenotypes = await Db.phenotypes
      .find({ directParents: 'HP:0000118' })
      .toArray();

    res.json(phenotypes);
  } catch (e) {
    res.status(500).send(`Error while fetching main areas: ${e.message}`);
  }
}

exports.findParentPhenotypes = findParentPhenotypes;
