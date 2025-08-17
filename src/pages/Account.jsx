// src/pages/Account.jsx
import React from 'react';
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const basePinkGradient = 'linear(to-r, #FFCFEF, #FFCFEF)';
const buttonHoverStyle = {
  transitionProperty: 'transform, background-image',
  transitionDuration: '0.2s, 0.8s',
  transitionTimingFunction: 'ease-in-out, ease-in-out',
  _hover: {
    transform: 'translateY(-3px)',
    bgGradient: 'linear(to-r, #FF6F91, #FFBC42)',
    color: '#FFFFFF',
    border: '2px solid #2A3335',
  },
};

export default function Account() {
  const { user, profile } = useAuth();

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDir="column"
      bgGradient="linear(to-br, #0A5EB0, #0A97B0)"
      color="#FFFFFF"
    >
      <Navbar />

      <Box as="main" flex="1" pt="20">
        <Container
          maxW="lg"
          // translucent card on blue gradient, with subtle pink border
          bg="rgba(255, 255, 255, 0.08)"
          rounded="xl"
          p={{ base: 6, md: 10 }}
          border="2px solid"
          borderColor="#FFCFEF"
          boxShadow="xl"
          backdropFilter="blur(6px)"
        >
          <Heading size="lg" mb={2} textShadow="2px 2px #2A3335">
            Account
          </Heading>
          <Text mb={6} color="whiteAlpha.800">
            Manage your profile, security, and preferences.
          </Text>

          <VStack align="stretch" spacing={3}>
            <Button
              {...buttonHoverStyle}
              bgGradient={basePinkGradient}
              border="2px solid #2A3335"
              textShadow="2px 2px #2A3335"
            >
              Account settings
            </Button>

            <Button
              variant="outline"
              borderColor="#FFCFEF"
              color="#FFFFFF"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              Change password
            </Button>

            <Button
              variant="outline"
              borderColor="#FFCFEF"
              color="#FFFFFF"
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              Delete account
            </Button>
          </VStack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
