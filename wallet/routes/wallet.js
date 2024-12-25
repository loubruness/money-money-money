import { Router } from 'express';
import { depositAction, withdrawAction, checkAction, transferAction } from '../controllers/wallet.js';

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

router.post('/:Id_User/transfer', (req, res) => {
    transferAction(req, res);
});

export default router;
