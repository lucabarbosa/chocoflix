import { Router } from 'express';

import AuthController from './auth.controller';
import AuthValidations from './auth.validations';

import validationHandler from '../../helpers/validation-handler';

const router = Router();

router.post(
  '/login',
  AuthValidations.login,
  validationHandler,
  AuthController.login
);

export default router;
