import { checkUser, getProperty, getWalletBalance, getWalletTransactions, insertTransaction, updateWalletBalance } from '../database/queries/wallet.js';

// Deposit money into the wallet.
export const depositAction = async (req, res) => {
    try {
      const Id_User = parseInt(req.params.Id_User, 10);
      const amount = parseInt(req.body.amount, 10);
      const user = await checkUser(Id_User);
      if (!user || user.length === 0) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      if (amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid amount' });
      }
      const wallet_balance = await getWalletBalance(Id_User);
      const new_balance = wallet_balance + amount;
      await updateWalletBalance(Id_User, new_balance);
      await insertTransaction(Id_User, 'deposit', amount);
      res.status(200).json({ success: true, wallet_balance: new_balance });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

// Withdraw money from the wallet.
export const withdrawAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const amount = parseInt(req.body.amount, 10);
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const wallet_balance = await getWalletBalance(Id_User);
    if (amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }
    if (amount > wallet_balance) {
      return res.status(400).json({ success: false, error: 'You dont have enough money on your account' });
    }
    const new_balance = wallet_balance - amount;
    await updateWalletBalance(Id_User, new_balance);
    await insertTransaction(Id_User, 'withdraw', amount);
    res.status(200).json({ success: true, wallet_balance: new_balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Check wallet balance and transactions.
export const checkAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
  }
    const wallet_balance = await getWalletBalance(Id_User);
    const wallet_transactions = await getWalletTransactions(Id_User);
    res.status(200).json({ success: true, wallet_balance, wallet_transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Receive monthly rental income from the property.
export const receiveMonthlyIncomeAction = async (req, res) => {
  try {
    const Id_Property = parseInt(req.params.Id_Property, 10);
    const Id_User = parseInt(req.params.Id_User, 10);
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const property = await getProperty(Id_User, Id_Property);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const { rental_income_rate, property_price } = property;

    const rentalRate = parseFloat(rental_income_rate);
    const propertyPrice = parseFloat(property_price);
    const monthly_income = ((rentalRate / 100) * propertyPrice) / 12;

    if (monthly_income <= 0) {
      return res.status(400).json({ success: false, error: 'You have nothing to receive from this property' });
    }
    const wallet_balance = await getWalletBalance(Id_User);
    const new_balance = wallet_balance + monthly_income;
    await updateWalletBalance(Id_User, new_balance);
    await insertTransaction(Id_User, 'rental_income', monthly_income);
    
    res.status(200).json({ success: true, wallet_balance: new_balance });
  } catch (error) {
    console.error("Error processing rental income:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
