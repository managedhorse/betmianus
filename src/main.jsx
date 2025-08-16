// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import './index.css';
import AuthProvider from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
       <App />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);