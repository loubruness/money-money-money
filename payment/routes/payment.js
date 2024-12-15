import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Payment service!');
});

export default router;