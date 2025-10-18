import React, { createContext, useContext } from 'react';

const StripeContext = createContext();

export const useStripe = () => useContext(StripeContext);

export const StripeProvider = ({ children }) => {
  // Mock Stripe functionality for demo
  const processPayment = async (amount, currency = 'GBP') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful payment
        resolve({
          success: true,
          paymentIntentId: 'pi_' + Math.random().toString(36).substr(2, 9),
          amount,
          currency
        });
      }, 2000);
    });
  };

  const value = {
    processPayment
  };

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  );
};