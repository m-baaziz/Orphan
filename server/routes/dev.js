const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;

const dev = express.Router();

dev.get('/playground', expressPlayground({ endpoint: '/graphql' }));

module.exports = dev;
