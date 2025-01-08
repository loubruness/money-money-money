import { checkUser, getWalletBalance, getWalletTransactions, getProperty, updateWalletBalance, insertTransaction } from '../database/queries/wallet.js';

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
    const Id_User = parseInt(req.params.Id_User, 10);
    const Id_Property = parseInt(req.params.Id_Property, 10);
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const rental_income = await getProperty(Id_User, Id_Property);
    const rental_income_rate = parseFloat(rental_income.rental_income_rate);
    
    const p_price = await getProperty(Id_User, Id_Property);
    const property_price = parseFloat(p_price.property_price);

    const monthly_income = ((rental_income_rate/100)*property_price)/12;
    if (monthly_income <= 0) {
      return res.status(400).json({ success: false, error: 'You have nothing to receive from this property' });
    }
    
    const wallet_balance = await getWalletBalance(Id_User);
    const new_balance = wallet_balance + monthly_income;
    await updateWalletBalance(Id_User, new_balance);
    await insertTransaction(Id_User, 'receive', monthly_income);
    res.status(200).json({ success: true, wallet_balance: new_balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
