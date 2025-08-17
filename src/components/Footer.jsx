// src/components/Footer.jsx
import React from 'react';
import { Box, Text, Link, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer({ bg = '#0A5EB0', color = '#FFFFFF' }) {
  return (
    <Box as="footer" w="full" py="4" bg={bg} color={color} textAlign="center">
      <nav aria-label="Footer">
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={{ base: 1, sm: 4 }}
          align="center"
          justify="center"
        >
          <Link
            as={RouterLink}
            to="/"
            color="inherit"
            _hover={{ textDecoration: 'underline' }}
          >
            Home
          </Link>
          <Link
            as={RouterLink}
            to="/terms"
            color="inherit"
            _hover={{ textDecoration: 'underline' }}
          >
            Terms
          </Link>
          <Link
            as={RouterLink}
            to="/privacy-policy"
            color="inherit"
            _hover={{ textDecoration: 'underline' }}
          >
            Privacy Policy
          </Link>
        </Stack>
      </nav>

      <Text
        mt={2}
        fontSize="sm"
        fontFamily="Raleway, sans-serif"
        fontWeight="medium"
        textShadow="1px 1px #2A3335"
      >
        © {new Date().getFullYear()} Bet Mianus. All rights reserved.
      </Text>
    </Box>
  );
}