import { body, param } from 'express-validator';

const CategoryValidations = {};

CategoryValidations.create = [
  body('name')
    .not()
    .isEmpty()
];

CategoryValidations.get = [
  param('id')
    .not()
    .isEmpty()
];

CategoryValidations.update = [
  param('id')
    .not()
    .isEmpty()
];

CategoryValidations.destroy = [
  param('id')
    .not()
    .isEmpty()
];

export default CategoryValidations;
