// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    // Keep Slackey for headings, but include Raleway as a fallback or secondary
    heading: "'Slackey', 'Raleway', sans-serif",
    // Use Raleway for the body, but also keep Inter as a secondary
    body: "'Raleway', 'Inter', system-ui, sans-serif",
  },
  colors: {
    primary: "#ff6f91",
    secondary: "#ffbc42",
    darkText: "#333333",
  },
});

export default theme;