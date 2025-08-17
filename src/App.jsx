import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppKitProvider } from './AppKitProvider';
import BetMianus from './pages/BetMianus.jsx';
import Logout from './pages/Logout.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'; 
import Terms from './pages/Terms.jsx'; 
import NotFound from './pages/NotFound.jsx';
import '@reown/appkit-wallet-button';

function App() {
  return (
    <AppKitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BetMianus />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppKitProvider>
  );
}

export default App;
