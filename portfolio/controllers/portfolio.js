// controllers/portfolio.js
import { getUserPortfolio, getMonthlyRentalIncome, addInvestment } from '../database/queries/portfolio.js';
import { getWalletBalance, updateWalletBalance } from '../database/queries/wallet.js';

// Get portfolio by end-user
export const getPortfolioAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const portfolio = await getUserPortfolio(Id_User);

    if (!portfolio || portfolio.length === 0) {
      return res.status(404).json({ success: false, message: 'No portfolio found for this user.' });
    }
    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get monthly rental income for a user
export const getMonthlyIncomeAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const totalIncome = await getMonthlyRentalIncome(Id_User);

    res.status(200).json({ success: true, monthly_rental_income: totalIncome });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Invest in a property
export const investAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const { Id_Property, amount } = req.body;

    if (!Id_Property || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid property ID or investment amount.' });
    }

    // Check user's wallet balance
    const wallet_balance = await getWalletBalance(Id_User);
    if (amount > wallet_balance) {
      return res.status(400).json({ success: false, error: 'Insufficient wallet balance to make the investment.' });
    }

    // Deduct amount from wallet and add investment
    const new_balance = wallet_balance - amount;
    await updateWalletBalance(Id_User, new_balance);
    await addInvestment(Id_User, Id_Property, amount);

    res.status(200).json({
      success: true,
      message: 'Investment successfully made.',
      new_wallet_balance: new_balance,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
