import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppKitProvider } from './AppKitProvider';
import BetMianus from './pages/BetMianus.jsx';
import Logout from './pages/Logout.jsx';
import '@reown/appkit-wallet-button';


function App() {
  return (
    <AppKitProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BetMianus />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AppKitProvider>
  );
}

export default App;
