import { Router } from 'express';

import categoriesRouter from './category';
import moviesRouter from './movie';
import usersRouter from './user';

const router = Router();

router.use('/categories', categoriesRouter);
router.use('/movies', moviesRouter);
router.use('/users', usersRouter);

export default router;
