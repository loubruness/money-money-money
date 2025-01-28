import {feedUserWalletAction, getUserPaymentsAction} from '../controllers/payment.js';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send({ response: 'Welcome to payment route', ok: true }).status(200);
});

router.get('/:Id_User', (req, res) => {
  getUserPaymentsAction(req, res);
});

router.post('/:Id_User', (req, res) => {
    feedUserWalletAction(req, res);
});

export default router;