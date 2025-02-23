// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppKitProvider } from './AppKitProvider';
import BetMianus from './pages/BetMianus.jsx';
import '@reown/appkit-wallet-button';

function App() {
  return (
    <AppKitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BetMianus />} />
        
        </Routes>
      </BrowserRouter>
    </AppKitProvider>
  );
}

export default App;