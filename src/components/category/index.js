import { Router } from 'express';
import categoryController from './category.controller';

const router = Router();

router.get('/', categoryController.index);
router.get('/:id', categoryController.get);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.destroy);

export default router;
