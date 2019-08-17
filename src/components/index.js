import { Router } from 'express';
import usersRoute from './user';

const router = Router();

router.use('/users', usersRoute);

export default router;
