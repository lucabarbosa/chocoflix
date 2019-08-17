import express from 'express';
import bodyParser from 'body-parser';

import database from './config/database';
import routes from './components';

import errorHandler from './helpers/error-handler';

const app = express();

const configureExpress = () => {
  app.use(bodyParser.json());
  app.use('/', routes);
  app.use(errorHandler);
  return app;
};

export default () => database.connect().then(configureExpress);
