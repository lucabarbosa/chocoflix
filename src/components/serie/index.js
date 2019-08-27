import { Router } from 'express';
import SerieController from './serie.controller';

const router = new Router();

router.get('/', SerieController.index);
router.get('/:serie', SerieController.get);
router.get('/:serie/:season', SerieController.getSeason);

router.post('/', SerieController.create);
router.post('/:serie', SerieController.appendSeason);
router.post('/:serie/:season', SerieController.appendEpisode);

router.put('/:serie', SerieController.update);
router.put('/:serie/:season', SerieController.updateSeason);
router.put('/:serie/:season/:episode', SerieController.updateEpisode);

router.delete('/:serie', SerieController.destroy);
router.delete('/:serie/:season', SerieController.destroySeason);
router.delete('/:serie/:season/:episode', SerieController.destroyEpisode);

export default router;
