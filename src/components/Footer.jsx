import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function Footer({ bg = '#0A5EB0', color = '#FFFFFF' }) {
  return (
    <Box as="footer" w="full" py="4" bg={bg} color={color} textAlign="center">
      <Text
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
