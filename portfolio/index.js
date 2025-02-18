import express from 'express';
import portfolio from './routes/portfolio.js';
import {db} from './database/db_connection.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/portfolio', portfolio);

app.listen(port, () => {
  console.log(`Account service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
});