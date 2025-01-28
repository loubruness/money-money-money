import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

// Fonction générique pour envoyer la requête vers un service distant
async function proxyRequest(req, res, serviceUrl, prefix) {
  try {
    const targetUrl = serviceUrl + req.url; // Construire l'URL cible
    console.log(`Forwarding request to: ${targetUrl}`);

    const options = {
      method: req.method, // Transmettre la méthode HTTP
      headers: { 
        ...req.headers, 
        host: undefined // Supprimer l'en-tête `host` pour éviter des conflits
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? req.body : undefined, // Ajouter le corps si nécessaire
    };

    const response = await fetch(targetUrl, options);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    const responseBody = isJson ? await response.json() : await response.text();

    // Transmettre la réponse au client
    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error('Error in proxyRequest:', error.message);
    res.status(500).send('An error occurred while connecting to the external service.');
  }
}

// Routes avec appel à la fonction générique
app.all('/account*', (req, res) => {
  const serviceUrl = process.env.ACCOUNT_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/account');
});

app.all('/properties*', (req, res) => {
  const serviceUrl = process.env.CATALOG_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/properties');
});

app.all('/emails*', (req, res) => {
  const serviceUrl = process.env.EMAIL_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/emails');
});

app.all('/payments*', (req, res) => {
  const serviceUrl = process.env.PAYMENT_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/payments');
});

app.all('portfolio*', (req, res) => {
  const serviceUrl = process.env.PORTFOLIO_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/portfolio');
});

app.all('/wallets*', (req, res) => {
  const serviceUrl = process.env.WALLET_SERVICE_URL;
  proxyRequest(req, res, serviceUrl, '/wallets');
});


app.listen(port, () => {
  console.log(`Payment service listening at http://localhost:${port}`);
});