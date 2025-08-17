// src/pages/PrivacyPolicy.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  List,
  ListItem,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const appBlueGradient = 'linear(to-br, #0A5EB0, #0A97B0)';

export default function PrivacyPolicy() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bgGradient={appBlueGradient}>
      <Navbar />

      <Box as="main" flex="1" pt="20">
        <Container maxW="3xl" px={0}>
          {/* Gradient frame around the white card */}
          <Box bgGradient={appBlueGradient} p="1.5" rounded="xl" boxShadow="2xl">
            <Box bg="white" color="gray.800" rounded="lg" p={{ base: 6, md: 10 }}>
              <Heading size="xl" mb={2}>Privacy Policy</Heading>
              <Text color="gray.600" mb={6}>
                Last updated: {new Date().toLocaleDateString()}
              </Text>

              <Heading size="md" mt={2} mb={2}>1) What this policy covers</Heading>
              <Text mb={4}>
                This Privacy Policy explains how Bet Mianus (“Bet Mianus”, “we”, “us”, “our”)
                collects, uses, and discloses information in connection with our website,
                applications, and games (the “Service”).
              </Text>

              <Heading size="md" mt={6} mb={2}>2) Data we collect & how we use it</Heading>
              <List spacing={3} mb={4}>
                <ListItem>
                  <Text>
                    <strong>Account &amp; usage data.</strong> You acknowledge and accept that we may
                    collect and use personal data as necessary to give you access to the Service and
                    allow participation in games. This can include identifiers (e.g., email, wallet
                    or device IDs), IP address, and usage statistics.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    <strong>Purposes.</strong> We use personal data to operate and improve the Service,
                    provide support, communicate important notices, and, where permitted, send you
                    information about features or promotions that may interest you (see Marketing below).
                  </Text>
                </ListItem>
              </List>

              <Heading size="md" mt={6} mb={2}>3) Legal basis &amp; compliance</Heading>
              <Text mb={4}>
                In collecting and handling personal data, we follow applicable data protection laws and
                industry best practices. We implement reasonable administrative, technical, and physical
                safeguards to protect your information; however, no method of transmission or storage is
                100% secure.
              </Text>

              <Heading size="md" mt={6} mb={2}>4) Marketing communications</Heading>
              <Text mb={4}>
                We may use your contact details to send you updates, new services, or promotions. You
                can opt out of direct marketing at any time by using unsubscribe options in messages or
                by contacting us (see “Contact”).
              </Text>

              <Heading size="md" mt={6} mb={2}>5) Sharing &amp; disclosure</Heading>
              <Text mb={3}>
                We do not sell your personal data. We may disclose personal data:
              </Text>
              <List spacing={3} mb={4}>
                <ListItem>
                  <Text>
                    <strong>To service providers/partners</strong> that support the operation of the
                    Service (e.g., hosting, analytics, email delivery, customer support). These parties
                    access data only to perform services for us and are subject to appropriate
                    obligations.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    <strong>To our personnel</strong> who need access to assist you and operate the
                    Service.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text>
                    <strong>For legal reasons</strong>, where required by law, regulation, legal process,
                    or to protect our rights, property, users, or the public.
                  </Text>
                </ListItem>
              </List>

              <Heading size="md" mt={6} mb={2}>6) Data retention</Heading>
              <Text mb={4}>
                We keep personal data as long as reasonably necessary for the purposes described in this
                policy (or as required by law). Data that is no longer needed will be deleted or
                anonymized. You may request access to or deletion of your personal data (subject to
                legal limitations).
              </Text>

              <Heading size="md" mt={6} mb={2}>7) Your rights</Heading>
              <Text mb={4}>
                Depending on your location, you may have rights to access, correct, delete, or restrict
                the use of your personal data, and to object to or opt out of certain processing.
                To exercise these rights, contact us (see “Contact”). We may request information to
                verify your identity before fulfilling requests.
              </Text>

              <Heading size="md" mt={6} mb={2}>8) Cookies</Heading>
              <Text mb={4}>
                To make your visit more user-friendly, keep track of visits, and improve our service,
                we use cookies and similar technologies. You can disable cookies in your browser
                settings; however, doing so may severely limit or prevent use of parts of the Service.
              </Text>

              <Heading size="md" mt={6} mb={2}>9) Children &amp; age limits</Heading>
              <Text mb={4}>
                Our Service is not directed to individuals under 18. Do not use the Service if you are
                under 18 or under the legal age in your jurisdiction.
              </Text>

              <Heading size="md" mt={6} mb={2}>10) Changes to this policy</Heading>
              <Text mb={4}>
                We may update this Privacy Policy from time to time. We will post the updated version
                on this page and update the “Last updated” date above.
              </Text>

              <Heading size="md" mt={6} mb={2}>11) Contact</Heading>
              <Text mb={1}>Support: <strong>betmianus-support@googlegroups.com</strong></Text>
              <Text mb={0}>Privacy/Legal: <strong>admin@betmian.us</strong></Text>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}