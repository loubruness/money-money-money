import dotenv from 'dotenv';
import email from './routes/email.js';
import express from 'express';

dotenv.config();


const app = express();
const port = 5000;


app.use(express.json());

app.use('/emails', email);

app.listen(port, () => {
  console.log(`Email service listening at http://localhost:${port}`);
});