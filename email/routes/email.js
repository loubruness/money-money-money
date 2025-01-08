import { sendCertificate, sendEmail } from '../controllers/email.js';

import { Router } from 'express';

const router = Router();

router.post('/sendEmail', (req, res) => {
    sendEmail(req, res);
});

router.post('/sendCertificate', (req, res) => {
    sendCertificate(req, res);
});

export default router;