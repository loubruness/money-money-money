import dotenv from 'dotenv';
import payment from './routes/payment.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = process.env.PORT;


app.use(express.json());

app.use('/payment', payment);

app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
  });