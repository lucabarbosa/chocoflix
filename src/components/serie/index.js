import { Router } from 'express';

import SerieController from './serie.controller';
import SerieValidations from './serie.validations';

import validationHandler from '../../helpers/validation-handler';

const router = new Router();

router.get('/', SerieController.index);
router.get('/:serie', SerieController.get);
router.get('/:serie/:season', SerieController.getSeason);

router.post(
  '/',
  SerieValidations.create,
  validationHandler,
  SerieController.create
);

router.post(
  '/:serie',
  SerieValidations.appendSeason,
  validationHandler,
  SerieController.appendSeason
);

router.post(
  '/:serie/:season',
  SerieValidations.appendEpisode,
  validationHandler,
  SerieController.appendEpisode
);

router.put('/:serie', SerieController.update);
router.put('/:serie/:season', SerieController.updateSeason);
router.put('/:serie/:season/:episode', SerieController.updateEpisode);

router.delete('/:serie', SerieController.destroy);
router.delete('/:serie/:season', SerieController.destroySeason);
router.delete('/:serie/:season/:episode', SerieController.destroyEpisode);

export default router;
