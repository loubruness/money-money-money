import express from 'express';
import payment from './routes/account.js';
import {db} from './database/db_connection.js';


const app = express();
const port = 5000;

app.use(express.json());
app.use('/account', payment);

app.listen(port, () => {
  console.log(`Account service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
});