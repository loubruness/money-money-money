import { checkAction, depositAction, receiveMonthlyIncomeAction, updateWalletBalanceAction, withdrawAction } from '../controllers/wallet.js';

import { Router } from 'express';

const router = Router();

router.get('/', (req,res) => {
  res.send({ response: 'Welcome to wallet route', ok: true }).status(200);
});

router.post('/:Id_User/deposit', (req, res) => {
    depositAction(req, res);
});

router.post('/:Id_User/withdraw', (req, res) => {
    withdrawAction(req, res);
});

router.put('/:Id_User/updateBalance', (req, res) => {
    updateWalletBalanceAction(req, res);
});

router.get('/:Id_User', checkAction);

router.get('/:Id_User/:Id_Property', (req, res) => {
    receiveMonthlyIncomeAction(req, res);
});

export default router;
