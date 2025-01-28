// controllers/portfolio.js
import { addInvestment, getMonthlyRentalIncome, getUserPortfolio } from '../database/queries/portfolio.js';
import dotenv from 'dotenv';

dotenv.config();

const wallet_service_url = process.env.WALLET_SERVICE_URL;

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
    let wallet_balance = 0;
    try{
      const response = await fetch(`${wallet_service_url}/wallets/${Id_User}`);
      const data = await response.json();
      if (!response || response.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      else {
        wallet_balance = data.wallet_balance;
        if (amount > wallet_balance) {
          return res.status(400).json({ success: false, error: 'Insufficient wallet balance to make the investment.' });
        }
    
        // Deduct amount from wallet and add investment
        const new_balance = wallet_balance - amount;
        console.log("New wallet balance:", new_balance);
        try {
          const response = await fetch(`${wallet_service_url}/wallets/${Id_User}/updateBalance`, {
            method: 'PUT',
            body: JSON.stringify({ new_balance: new_balance }),
            headers: { 'Content-Type': 'application/json' },
          });
          if(!response.ok){
            throw new Error(`Error updating wallet balance: ${response.statusText}`);
          }
          
          await addInvestment(Id_User, Id_Property, amount);
      
          res.status(200).json({
            success: true,
            message: 'Investment successfully made.',
            new_wallet_balance: new_balance,
          });
        }
        catch(error){
          console.error("Error updating wallet balance:", error);
          return res.status(500).json({ success: false, error: error.message });
        }
      }
    }catch(error){
      console.error("Error fetching wallet balance:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
