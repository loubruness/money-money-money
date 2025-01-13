import express from 'express';
import payment from './routes/payment.js';
import {db} from './database/db_connection.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;


app.use('/payments', payment);
// Fonction générique pour envoyer la requête vers un service distant
async function proxyRequest(req, res, serviceUrl, prefix) {
  
  console.log(`prefix ${prefix}`);
  const targetUrl = serviceUrl + req.url.replace(prefix, '');  // Retirer le préfixe de l'URL
  console.log(`Forwarding request to ${targetUrl}`);
  try {
    // Effectuer la requête HTTP avec fetch
    const response = await fetch(targetUrl, {
      method: req.method,             // Conserver la méthode HTTP (GET, POST, etc.)
      headers: req.headers,           // Conserver les en-têtes de la requête d'origine
      body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,  // Envoyer le corps pour POST/PUT
    });

    // Récupérer la réponse du service distant
    const responseBody = await response.text();  // ou response.json() si vous attendez un JSON
    res.status(response.status).send(responseBody);  // Retourner la réponse à l'utilisateur

  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    res.status(500).send('An error occurred while connecting to the external service.');
  }
}

// Routes avec appel à la fonction générique
app.all('/service-account*', (req, res) => {
  const serviceUrl = process.env.ACCOUNT_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/service-account');
});

app.all('/catalog*', (req, res) => {
  const serviceUrl = process.env.CATALOG_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/catalog');
});

app.all('/email*', (req, res) => {
  const serviceUrl = process.env.EMAIL_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/email');
});

app.all('/payment*', (req, res) => {
  const serviceUrl = process.env.PAYMENT_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/payment');
});
app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
});