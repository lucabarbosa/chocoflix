import { body } from 'express-validator';

const AuthValidations = {};

AuthValidations.login = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
];

export default AuthValidations;
