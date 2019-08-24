import { Router } from 'express';

import categoriesRoute from './category';
import usersRoute from './user';

const router = Router();

router.use('/categories', categoriesRoute);
router.use('/users', usersRoute);

export default router;
