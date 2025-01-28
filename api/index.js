import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import e from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

const sendRequest = async (req, res, serviceUrl, method) => {
  try {
    // Recréer l'URL complète du service cible
    const url = `${serviceUrl}${req.url}`;
    console.log(`Forwarding ${method} request to:`, url);

    const config = {
      method,
      url,
      data: method !== 'GET' ? req.body : undefined,
    };

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erreur du service distant:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Erreur lors du forward de la requête:', error.message);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
};

const proxyRequest = async (req, res, serviceUrl) => {
  const { method } = req;

  if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    await sendRequest(req, res, serviceUrl, method);
  } else {
    console.error(`Méthode ${method} non supportée`);
    res.status(405).json({ message: 'Méthode non supportée' });
  }
};


app.get('/', (req, res) => {
  res.send('Welcome to the API service');
});
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