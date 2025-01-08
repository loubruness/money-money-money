import { Router } from 'express';
import { createProfileAction } from '../controllers/account.js';

const router = Router();

router.post('/create', (req, res) => {
  createProfileAction(req, res);
});

router.get('/', (req, res) => {
  res.send({ response: 'Welcome to account route', ok: true }).status(200);
});

export default router;
