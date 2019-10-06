const { MongoClient } = require('mongodb');
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DISORDERS_COLLECTION,
  PHENOTYPES_COLLECTION,
  DISORDERS_CLASSIFICATION_COLLECTION,
  PHENOTYPES_CLASSIFICATION_COLLECTION,
} = require('../config');

const instance = null;

class Db {
  static getInstance() {
    return instance || new Db();
  }

  constructor() {
    this.client = null;
    this.disordersCollection = null;
    this.phenotypesCollection = null;
    this.disordersClassificationCollection = null;
    this.phenotypesClassificationCollection = null;
  }

  async init() {
    try {
      console.log('initalizing db ...');

      this.client = await MongoClient.connect(
        `mongodb://${DB_HOST}:${DB_PORT}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      );
      this.disordersCollection = this.client
        .db(DB_NAME)
        .collection(DISORDERS_COLLECTION);
      this.phenotypesCollection = this.client
        .db(DB_NAME)
        .collection(PHENOTYPES_COLLECTION);
      this.disordersClassificationCollection = this.client
        .db(DB_NAME)
        .collection(DISORDERS_CLASSIFICATION_COLLECTION);
      this.phenotypesClassificationCollection = this.client
        .db(DB_NAME)
        .collection(PHENOTYPES_CLASSIFICATION_COLLECTION);

      console.log('db initialized');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  get disorders() {
    if (!this.disordersCollection) {
      throw Error('Db not initialized yet');
    }
    return this.disordersCollection;
  }

  get phenotypes() {
    if (!this.phenotypesCollection) {
      throw Error('Db not initialized yet');
    }
    return this.phenotypesCollection;
  }

  get disordersClassification() {
    if (!this.disordersClassificationCollection) {
      throw Error('Db not initialized yet');
    }
    return this.disordersClassificationCollection;
  }

  get phenotypesClassification() {
    if (!this.phenotypesClassificationCollection) {
      throw Error('Db not initialized yet');
    }
    return this.phenotypesClassificationCollection;
  }
}

module.exports = Db.getInstance();
