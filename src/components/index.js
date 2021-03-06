import { Router } from 'express';

import authRouter from './auth';
import categoriesRouter from './category';
import moviesRouter from './movie';
import seriesRouter from './serie';
import usersRouter from './user';

const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);
router.use('/movies', moviesRouter);
router.use('/series', seriesRouter);
router.use('/users', usersRouter);

export default router;
