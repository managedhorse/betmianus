import React from 'react';
import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="#ffbed9">
      <Navbar />
      <Box as="main" flex="1" pt="20">
        <Container maxW="3xl" bg="white" rounded="md" p={{ base: 6, md: 10 }} boxShadow="md">
          <Heading size="lg" mb={2}>Page not found</Heading>
          <Text mb={6}>The page you’re looking for doesn’t exist.</Text>
          <Button as={RouterLink} to="/" colorScheme="blue">Go home</Button>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
