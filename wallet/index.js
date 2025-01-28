import express from 'express';
import wallet from './routes/wallet.js';
import {db} from './database/db_connection.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/wallets', wallet);

app.listen(port, () => {
  console.log(`wallet service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
});