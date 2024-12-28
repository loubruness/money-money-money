// database/queries/portfolio.js
import { db } from '../db_connection.js';

// Get all investments for a user, including related property details
export const getUserPortfolio = async (Id_User) => {
  try {
    return await db('Investment')
      .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
      .select(
        'Investment.Id_Investment',
        'Investment.investment_amount',
        'Investment.created_at',
        'Property.property_name',
        'Property.property_type',
        'Property.property_price',
        'Property.rental_income_rate',
        'Property.appreciation_rate',
        'Property.funding_deadline'
      )
      .where('Investment.Id_User', Id_User);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
};

// Calculate total monthly rental income dynamically
export const getMonthlyRentalIncome = async (Id_User) => {
  try {
    const result = await db('Investment')
      .join('Property', 'Investment.Id_Property', '=', 'Property.Id_Property')
      .select('Investment.investment_amount', 'Property.rental_income_rate', 'Property.property_price')
      .where('Investment.Id_User', Id_User);

    let totalIncome = 0;
    result.forEach((row) => {
      const monthlyIncome = (row.rental_income_rate / 100) * row.property_price;
      totalIncome += monthlyIncome;
    });
    return totalIncome;
  } catch (error) {
    console.error('Error calculating rental income:', error);
    return 0;
  }
};

// Add a new investment for a user
export const addInvestment = async (Id_User, Id_Property, amount) => {
  try {
    const newInvestment = {
      Id_User,
      Id_Property,
      investment_amount: amount,
      created_at: new Date().toISOString(),
    };
    await db('Investment').insert(newInvestment);
  } catch (error) {
    console.error('Error adding investment:', error);
    throw error;
  }
};
