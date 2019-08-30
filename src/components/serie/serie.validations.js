import { body, param } from 'express-validator';

const SerieValidations = {};

SerieValidations.create = [body('title').exists()];

SerieValidations.appendSeason = [param('serie').exists()];

SerieValidations.appendEpisode = [
  body('title').exists(),
  body('description').exists(),
  body('filePath').exists(),
  body('duration').exists(),
  param('serie').exists(),
  param('season').exists()
];

export default SerieValidations;
