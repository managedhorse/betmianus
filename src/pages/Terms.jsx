// src/pages/Terms.jsx
import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="#ffbed9">
      <Navbar />
      <Box as="main" flex="1" pt="20">
        <Container maxW="3xl" bg="white" rounded="md" p={{ base: 6, md: 10 }} boxShadow="md">
          <Heading size="xl">Terms of Service</Heading>
          {/* …content… */}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}