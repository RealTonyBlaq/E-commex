import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router = Router();

router.post('/users', (req, res) => UserController.createUser(req, res));


export default router;
