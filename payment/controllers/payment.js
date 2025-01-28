import { getUserPayments, insertPayment, feedUserWallet, checkUser } from "../database/queries/payment.js";

// Pay for a service using the wallet.
export const feedUserWalletAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User);
    const amount = req.body.amount;
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }
    const payment = await feedUserWallet(Id_User, amount);
    if (!payment || payment.length === 0) {
      await insertPayment(Id_User, amount, 'failed');
      return res.status(500).json({ success: false, error: 'Failed to feed wallet' });
    }
    
    await insertPayment(Id_User, amount, 'success');

    res.status(200).json({ success: true, wallet_balance: payment[0].wallet_balance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get all payments for the user.
export const getUserPaymentsAction = async (req, res) => {
  try {
    const Id_User = parseInt(req.params.Id_User, 10);
    const user = await checkUser(Id_User);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const userPayments = await getUserPayments(Id_User);
    res.status(200).json({ success: true, userPayments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}