import { Router } from 'express';

import UserConstroller from './user.controller';
import UserValidations from './user.validations';

import validationHandler from '../../helpers/validation-handler';

const router = Router();

router.get('/', UserConstroller.index);

router.get(
  '/:email',
  UserValidations.get,
  validationHandler,
  UserConstroller.get
);

router.post(
  '/',
  UserValidations.create,
  validationHandler,
  UserConstroller.create
);

router.put(
  '/:email',
  UserValidations.update,
  validationHandler,
  UserConstroller.update
);

router.delete(
  '/:email',
  UserValidations.destroy,
  validationHandler,
  UserConstroller.destroy
);

export default router;
