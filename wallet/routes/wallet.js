import { Router } from 'express';
import { depositAction, withdrawAction, checkAction, receiveMonthlyIncomeAction } from '../controllers/wallet.js';

const router = Router();

router.get('/', (res) => {
  res.send({ response: 'Welcome to wallet route', ok: true }).status(200);
});

router.post('/:Id_User/deposit', (req, res) => {
    depositAction(req, res);
});

router.post('/:Id_User/withdraw', (req, res) => {
    withdrawAction(req, res);
});

router.get('/:Id_User', checkAction);

router.get('/:Id_User/:Id_Property', (req, res) => {
    receiveMonthlyIncomeAction(req, res);
});

export default router;
