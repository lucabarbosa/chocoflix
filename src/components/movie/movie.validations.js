import { body } from 'express-validator';

const MovieValidations = {};

MovieValidations.create = [body('title').exists()];

MovieValidations.append = [
  body('title').exists(),
  body('description').exists(),
  body('filePath').exists(),
  body('duration').exists()
];

export default MovieValidations;
