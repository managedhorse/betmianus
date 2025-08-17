import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  OrderedList,
  UnorderedList,
  ListItem,
  Divider,
} from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" bg="#ffbed9">
      <Navbar />
      <Box as="main" flex="1" pt="20">
        <Container maxW="3xl" bg="white" rounded="md" p={{ base: 6, md: 10 }} boxShadow="md">
          <Heading size="xl" mb={2}>Terms of Service</Heading>
          <Text color="gray.600" mb={6}>Last updated: {new Date().toLocaleDateString()}</Text>

          {/* Intro / Consent */}
          <Text mb={4}>
            Welcome to Bet Mianus (“Bet Mianus”, “we”, “our”, “us”). These Terms of Service
            (“Terms”) govern your access to and use of our website, applications, games, and
            related services (collectively, the “Service”). By accessing or using the Service,
            you agree to be bound by these Terms.
          </Text>

          

          <Heading size="md" mt={8} mb={2}>1. Grant of License</Heading>
          <OrderedList pl={5} mb={4}>
            <ListItem>
              Subject to these Terms, Bet Mianus grants you a personal, non-exclusive,
              non-transferable license to access and use the Service on your own device for
              entertainment purposes only.
            </ListItem>
            <ListItem>
              You may not use the Service if you are (i) under 18, (ii) under the legal age
              of majority in your jurisdiction, or (iii) in a jurisdiction where use of the
              Service is illegal. You are solely responsible for ensuring your use is lawful.
            </ListItem>
            <ListItem>
              All rights in and to the Service (including code, structure, organization,
              trademarks, and content) are owned by Bet Mianus and/or its licensors. You must
              not copy, distribute, reverse engineer, decompile, disassemble, modify, translate,
              or use the Service in violation of applicable law.
            </ListItem>
          </OrderedList>

          <Heading size="md" mt={8} mb={2}>2. No Warranties</Heading>
          <OrderedList pl={5} mb={4}>
            <ListItem>
              The Service is provided “as is” and “as available” without warranties of any kind,
              whether express or implied, including fitness for a particular purpose, completeness,
              or accuracy.
            </ListItem>
            <ListItem>
              We do not warrant that the Service will be uninterrupted, timely, secure, or error-free.
            </ListItem>
          </OrderedList>

          <Heading size="md" mt={8} mb={2}>3. Authority / Rules</Heading>
          <Text mb={4}>
            You agree to the rules and game terms published on the Bet Mianus site. We retain full
            authority over issuing, maintaining, and closing the Service. Our management decisions
            are final.
          </Text>

          <Heading size="md" mt={8} mb={2}>4. Player Obligations</Heading>
          <OrderedList pl={5} mb={4}>
            <ListItem>You are 18+ (or the higher legal age in your jurisdiction).</ListItem>
            <ListItem>You participate for personal, recreational purposes only and on your own behalf.</ListItem>
            <ListItem>Information you provide is true, complete, and kept current.</ListItem>
            <ListItem>You are solely responsible for taxes on your winnings (if any).</ListItem>
            <ListItem>You understand you can lose virtual funds and that crypto values can fluctuate.</ListItem>
            <ListItem>No fraudulent, collusive, or unlawful activity; no software-assisted cheating.</ListItem>
            <ListItem>No third-party payment methods; no sale/transfer of accounts.</ListItem>
            <ListItem>
              If you detect an error or bug, you will not exploit it and will report it to us immediately.
            </ListItem>
            <ListItem>
              If a game is interrupted by a system failure, we may refund the stake and/or credit any
              recorded winnings per game rules.
            </ListItem>
            <ListItem>We may request verification (KYC) and suspend access until completed.</ListItem>
          </OrderedList>

          <Heading size="md" mt={8} mb={2}>5. Prohibited Uses & Jurisdictions</Heading>
          <Text mb={2}>
            The Service is for personal use only. Creating multiple accounts or abusing services is prohibited.
          </Text>
          <Text mb={2}>
            You may not use the Service if you are located in or a resident of any of the
            following jurisdictions:
          </Text>
          <UnorderedList pl={5} mb={4}>
            <ListItem>
              Aruba, Australia, Bonaire, Brazil, Canada (including Ontario), Curaçao, France, Iran, Iraq,
              Netherlands, Saba, Spain, St. Maarten, St. Eustatius (Statia), the United States of America
              (and its territories), or the United Kingdom.
            </ListItem>
          </UnorderedList>
          <Text mb={4}>
            Attempts to bypass geographic restrictions (e.g., via VPN/proxy) violate these Terms.
          </Text>

          <Heading size="md" mt={8} mb={2}>6. KYC & Verification</Heading>
          <Text mb={4}>
            We may request identity, age, and location verification. We may restrict service or
            payments until verification is satisfactorily completed.
          </Text>

          <Heading size="md" mt={8} mb={2}>7. Errors, Interruptions, & Voids</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>
              We may declare a wager void (in whole or part) if we determine, at our discretion,
              that outcomes were influenced, rules were circumvented, criminal activity occurred,
              technical errors occurred, or odds/markets were misquoted/misconfigured.
            </ListItem>
            <ListItem>
              If a confirmed deposit has an insufficient network fee or is otherwise flagged as invalid,
              we may void related winnings in cases of suspected fraud.
            </ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>8. Wagers & Payouts</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>Only registered account holders may place wagers.</ListItem>
            <ListItem>Wagers must be placed online and cannot exceed available balance.</ListItem>
            <ListItem>Once placed, a wager cannot be amended, withdrawn, or canceled.</ListItem>
            <ListItem>
              Winnings (if any) are credited after results are confirmed. We may adjust payouts
              made in error.
            </ListItem>
            <ListItem>
              Account balances and records maintained by Bet Mianus are deemed final unless proven otherwise.
            </ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>9. Bonuses & Promotions</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>
              We may cancel, modify, or revoke any promotion/bonus if set up incorrectly, abused, or
              if irregular play is detected. Verification may be required.
            </ListItem>
            <ListItem>
              Bonuses are generally one-per person/account/household/IP/shared environment and may
              carry wagering or withdrawal restrictions.
            </ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>10. Live Chat</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>Be courteous; no abusive, defamatory, harassing, or unlawful content.</ListItem>
            <ListItem>We may monitor, remove, or disable chat, and/or terminate accounts for violations.</ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>11. Limitation of Liability</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>
              You access the Service at your own risk. To the maximum extent permitted by law, Bet Mianus
              shall not be liable for indirect, incidental, special, consequential, or exemplary damages.
            </ListItem>
            <ListItem>
              Our total liability to you for any claim shall not exceed €100.
            </ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>12. Disputes</Heading>
          <Text mb={4}>
            If you have a complaint, contact us using the details below. If not resolved, you may seek
            remedies in the governing jurisdiction specified in these Terms.
          </Text>

          <Heading size="md" mt={8} mb={2}>13. Amendments</Heading>
          <Text mb={4}>
            We may update these Terms at any time by posting the revised version on the site. Your
            continued use of the Service constitutes acceptance of the revised Terms.
          </Text>

          <Heading size="md" mt={8} mb={2}>14. Governing Law & Jurisdiction</Heading>
          <Text mb={4}>
            These Terms shall be governed by the laws of Curaçao. You irrevocably submit to the
            exclusive jurisdiction of the courts of Curaçao (without prejudice to our right to bring
            proceedings in other competent courts).
          </Text>

          <Heading size="md" mt={8} mb={2}>15. Assignment</Heading>
          <Text mb={4}>
            We may assign these Terms at any time. You may not assign your rights or obligations under these Terms.
          </Text>

          <Heading size="md" mt={8} mb={2}>16. Advantage Play</Heading>
          <Text mb={4}>
            If we determine you accepted a bonus or promotion to create a guaranteed advantage (e.g., hedge bets,
            delayed game rounds), we may confiscate winnings and/or close your account.
          </Text>

          <Heading size="md" mt={8} mb={2}>17. Self-Exclusion</Heading>
          <UnorderedList pl={5} mb={4}>
            <ListItem>You may request self-exclusion for 1, 3, 6, or 12 months, or permanently.</ListItem>
            <ListItem>During self-exclusion, access and withdrawals may be restricted per policy.</ListItem>
            <ListItem>
              After the period ends, you may request reinstatement via customer support (subject to checks).
            </ListItem>
          </UnorderedList>

          <Heading size="md" mt={8} mb={2}>18. Contact</Heading>
          <Text mb={1}>Support: <strong>betmianus-support@googlegroups.com</strong></Text>
          <Text mb={4}>Legal/Notices: <strong>admin@betmian.us</strong></Text>

          
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
