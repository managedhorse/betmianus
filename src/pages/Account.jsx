// src/pages/Account.jsx
import React from 'react';
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, profile } = useAuth();
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="#ffbed9">
      <Navbar />
      <Box as="main" flex="1" pt="20">
        <Container maxW="3xl" bg="white" rounded="md" p={{ base: 6, md: 10 }} boxShadow="md">
          <Heading size="lg" mb={4}>Account</Heading>
          <VStack align="start" spacing={4}>
            <Text color="gray.700">Manage your profile, security, and preferences.</Text>
            <Button size="sm" variant="outline">Change password</Button>
            <Button size="sm" variant="outline">Delete account</Button>
            {/* add whatever you like here */}
          </VStack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}