import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Buyer from './pages/Buyer';
import Seller from './pages/Seller';
import MarketPrices from './pages/MarketPrices';
import BrowseCredits from './pages/BrowseCredits';
import WhatIsCarbonCredit from './pages/WhatIsCarbonCredit';
import Greenwashing from './pages/Greenwashing';
import PricingExplained from './pages/PricingExplained';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/buyer" element={<PageWrapper><Buyer /></PageWrapper>} />
          <Route path="/seller" element={<PageWrapper><Seller /></PageWrapper>} />
          <Route path="/market-prices" element={<PageWrapper><MarketPrices /></PageWrapper>} />
          <Route path="/browse-credits" element={<PageWrapper><BrowseCredits /></PageWrapper>} />
          <Route path="/what-is-carbon-credit" element={<PageWrapper><WhatIsCarbonCredit /></PageWrapper>} />
          <Route path="/greenwashing" element={<PageWrapper><Greenwashing /></PageWrapper>} />
          <Route path="/pricing-explained" element={<PageWrapper><PricingExplained /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
