import { Router } from 'express';
import UserConstroller from './user.controller';

const router = Router();

router.get('/', UserConstroller.index);
router.get('/:email', UserConstroller.get);
router.post('/', UserConstroller.create);
router.put('/:email', UserConstroller.update);
router.delete('/:email', UserConstroller.destroy);

export default router;
