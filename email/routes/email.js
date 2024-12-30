import { Router } from 'express';
import { sendEmail } from '../controllers/email.js';

const router = Router();

router.post('/sendEmail', (req, res) => {
    sendEmail(req, res);
});

export default router;