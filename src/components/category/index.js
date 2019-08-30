import { Router } from 'express';

import categoryController from './category.controller';
import categoryValidations from './category.validations';

import validationHandler from '../../helpers/validation-handler';

const router = Router();

router.get('/', categoryController.index);

router.get(
  '/:id',
  categoryValidations.get,
  validationHandler,
  categoryController.get
);

router.post(
  '/',
  categoryValidations.create,
  validationHandler,
  categoryController.create
);

router.put(
  '/:id',
  categoryValidations.update,
  validationHandler,
  categoryController.update
);

router.delete(
  '/:id',
  categoryValidations.destroy,
  validationHandler,
  categoryController.destroy
);

export default router;
