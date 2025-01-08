// routes/portfolio.js
import { Router } from 'express';
import { getPortfolioAction, getMonthlyIncomeAction, investAction } from '../controllers/portfolio.js';

const router = Router();

router.get('/:Id_User', (req, res) => {
  getPortfolioAction(req, res);
}); // Get portfolio by end-user
router.get('/:Id_User/monthly-income', (req, res) => {
  getMonthlyIncomeAction(req, res);
}); // Get monthly rental income
router.post('/:Id_User/invest', (req, res) => {
  investAction(req, res);
}); // Invest in a property

export default router;

