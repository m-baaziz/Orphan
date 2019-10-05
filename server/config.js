const sparqlUrl = namespace => `http://172.17.0.2:9999/blazegraph/namespace/${namespace}/sparql`;

module.exports = {
  "HPO_URL": sparqlUrl('hpo'),
  "ORDO_URL": sparqlUrl('ordo'),
  "DB_HOST": process.env.DB_HOST || "localhost",
  "DB_PORT": 27017,
  "DB_NAME": "kibo",
  "DISORDERS_COLLECTION": "disorders",
  "PHENOTYPES_COLLECTION": "phenotypes",
  "DISORDERS_CLASSIFICATION_COLLECTION": "disorders_classification",
  "PHENOTYPES_CLASSIFICATION_COLLECTION": "phenotypes_classification"
};
