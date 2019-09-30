module.exports = {
  "SPARQL_URL": "http://172.17.0.2:9999/blazegraph/namespace/hpo/sparql",
  "DB_HOST": process.env.DB_HOST || "localhost",
  "DB_PORT": 27017,
  "DB_NAME": "kibo",
  "DISORDERS_COLLECTION": "disorders",
  "PHENOTYPE_CLASSIFICATIONS_COLLECTION": "phenotype_classifications",
  "PHENOTYPES_COLLECTION": "phenotypes",
  "DISORDER_CLASSIFICATIONS_COLLECTION": "disorder_classifications"
};
