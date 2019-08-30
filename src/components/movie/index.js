import { Router } from 'express';

import MovieController from './movie.controller';
import MovieValidations from './movie.validations';

import validationHandler from '../../helpers/validation-handler';

const router = Router();

router.get('/', MovieController.index);
router.get('/:id', MovieController.get);
router.get('/:id/:movie', MovieController.getFromSaga);

router.post(
  '/',
  MovieValidations.create,
  validationHandler,
  MovieController.create
);

router.post(
  '/:id',
  MovieValidations.append,
  validationHandler,
  MovieController.append
);

router.put('/:id', MovieController.update);
router.put('/:id/:movie', MovieController.updateOnSaga);

router.delete('/:id', MovieController.destroy);
router.delete('/:id/:movie', MovieController.destroyOnSaga);

export default router;
