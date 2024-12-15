import express from 'express';
import payment from './routes/payment.js';
import {db} from './database/db_connection.js';


const app = express();
const port = 5000;


app.use('/payments', payment);

app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
});