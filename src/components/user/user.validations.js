import { body, param } from 'express-validator';

const UserValidations = {};

UserValidations.create = [
  body('name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
];

UserValidations.get = [param('email').isEmail()];

UserValidations.update = [
  body('password').isLength({ min: 5 }),
  param('email').isEmail()
];

UserValidations.destroy = [
  body('password').isLength({ min: 5 }),
  param('email').isEmail()
];

export default UserValidations;
