import React, { createContext, useContext, useState } from 'react';

// Conversion rate: 1 USD = 85.00 INR
export const USD_TO_INR = 85.0;

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  // Default to INR for Indian Farmers & Indian Corporate Market
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('bhoomi_currency') || 'INR';
  });

  const setCurrency = (curr) => {
    if (curr === 'INR' || curr === 'USD') {
      setCurrencyState(curr);
      localStorage.setItem('bhoomi_currency', curr);
    }
  };

  /**
   * Convert and format a base USD price into active currency (₹ INR or $ USD)
   */
  const formatPrice = (usdPrice, options = {}) => {
    const num = parseFloat(usdPrice) || 0;

    if (currency === 'INR') {
      const inrValue = num * USD_TO_INR;
      if (options.compact && inrValue >= 10000000) {
        return `₹${(inrValue / 10000000).toFixed(2)} Cr`;
      }
      if (options.compact && inrValue >= 100000) {
        return `₹${(inrValue / 100000).toFixed(2)} Lakh`;
      }
      return `₹${Math.round(inrValue).toLocaleString('en-IN')}`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  const symbol = currency === 'INR' ? '₹' : '$';

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, symbol, USD_TO_INR }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
