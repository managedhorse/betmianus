// src/components/CasinoSection.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import Sportsbook from '../images/sportsbook.webp';
import lottery from '../images/lottery.webp';
import esports from '../images/esport.webp';
import slots from '../images/slots.webp';
import tablegame from '../images/tablegame.webp';
import cryptogame from '../images/cryptogame.webp';
import trading from '../images/trading.webp';
import hashgame from '../images/hashgame.webp';

const MotionBox = motion.create(Box);

const CasinoSection = () => {

  const cardBg = useColorModeValue('whiteAlpha.100', 'whiteAlpha.100');


  const featureCards = [
    {
      title: 'Crypto Games',
      image: cryptogame,
      description:
        "Discover Bet Mianus's array of blockchain-powered originals, like Crash and Plinko. Harness provably fair technology with speedy crypto deposits and near-instant withdrawals for an exhilarating gaming experience.",
    },
    {
      title: 'Slots',
      image: slots,
      description:
        'Online slots remain a crowd favorite, offering massive jackpots and immersive themes. Spin through classics or multi-payline slots filled with bonus rounds and progressive prizes—perfect for newcomers and veterans alike.',
    },
  ];


  const listItems = [
    {
      title: 'Hash Games',
      image: hashgame,
      description:
        'Dive into our hash-based RNG titles, built with provably fair logic. Every wager is verifiable and transparent, guaranteeing a trustworthy outcome each time you play.',
    },
    {
      title: 'Sportsbook',
      image: Sportsbook,
      description:
        'From the English Premier League to NBA hoops, Bet Mianus covers top sporting events worldwide with competitive odds. Bet live, watch the action, and cash out with confidence.',
    },
    {
      title: 'Table Games',
      image: tablegame,
      description:
        'Experience the thrill of classic table games—Blackjack, Roulette, Baccarat, and more. Choose a live-dealer stream or animated tables using real number generators.',
    },
    {
      title: 'Esports',
      image: esports,
      description:
        'Bet on leading Esports tournaments in Dota2, CS:GO, and League of Legends. Enjoy major events all year, with secure wagers and timely payouts on every big match.',
    },
    {
      title: 'Lottery',
      image: lottery,
      description:
        'Join our weekly draws for a shot at escalating jackpots. Straightforward gameplay, transparent results, and plenty of ways to win—lottery fun is just a ticket away.',
    },
    {
      title: 'Trading',
      image: trading,
      description:
        'Trade top cryptocurrencies with leverage up to 1000x. Enjoy instant execution, minimal fees, and a robust platform supporting BTC, ETH, SOL, and more.',
    },
  ];

  return (
    <MotionBox
      id="casino"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      as="section"
      py={12}
      px={4}
      bg="gray.900"
      color="white"
    >
      <Container maxW="container.lg">
   
        <VStack spacing={4} textAlign="center" mb={10}>
          <Heading
            as="h2"
            fontFamily="Slackey, cursive"
            fontSize={{ base: '28px', md: '32px' }}
            textTransform="uppercase"
          >
            Gaming Wonderland of Mianus
          </Heading>
          <Text fontSize="lg" maxW={{ base: 'md', md: 'lg' }}>
            Plunge into Mianus and uncover a world of thrills, where every game is
            secure, fair, and immersive.
          </Text>
        </VStack>

  
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={12}>
          {featureCards.map(({ title, image, description }) => (
            <MotionBox
              key={title}
              bg={cardBg}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="lg"
              whileHover={{ scale: 1.03 }}
              transition="all 0.3s ease"
            >
            
              <Box w="100%" h="200px" bg="transparent" overflow="hidden">
                <Image
                  src={image}
                  alt={title}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  bg="transparent"
                />
              </Box>
              <Box p={6}>
                <Heading as="h3" fontSize="xl" mb={2}>
                  {title}
                </Heading>
                <Text fontSize="md">{description}</Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>


        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {listItems.map(({ title, image, description }) => (
            <MotionBox
              key={title}
              bg={cardBg}
              borderRadius="md"
              overflow="hidden"
              boxShadow="md"
              p={4}
              whileHover={{ translateY: -3 }}
              transition="transform 0.2s"
            >
              <HStack spacing={4}>
                <Image
                  src={image}
                  alt={title}
                  boxSize="80px"
                  objectFit="contain"
                  borderRadius="md"
                  bg="transparent"
                />
                <Box>
                  <Heading as="h4" fontSize="lg" color="blue.400">
                    {title}
                  </Heading>
                  <Text fontSize="sm">{description}</Text>
                </Box>
              </HStack>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </MotionBox>
  );
};

export default CasinoSection;
