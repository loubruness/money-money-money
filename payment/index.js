import express from 'express';
import  payment  from './routes/payment.js';


const app = express();
const port = 5000;


app.use('/payments', payment);

app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
});