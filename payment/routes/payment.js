import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({response: 'Payment accepted',ok:true}).status(200);
});

export default router;