// src/components/AboutSection.jsx
import React from 'react';
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  SimpleGrid,
  Container,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import { FaDollarSign, FaHandHoldingUsd, FaChartPie, FaChartLine, FaGem, FaWaveSquare } from 'react-icons/fa';

import CoinsmallR from '../images/coinsmallR.webp';
import fair from '../images/fair.webp';
import chains from '../images/chains.webp';
import ggr from '../images/ggr.webp';
import CoinTickerRandom from '../components/CoinTicker';
import Betpreview from '../images/betPreview.webp';
import Animatedarrow from '../components/AnimatedArrow';

const MotionBox = motion.create(Box);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};


function CombinedIcon({ BackgroundIcon,boxsize = 50, iconsize = 40, imgsize = 35}) {
  return (
    <Box position="relative" boxSize={`${boxsize}px`}>
   
      <Box position="absolute" top="0" right="0" zIndex={0}>
        <BackgroundIcon size={iconsize} color="#FFFFFF" />
      </Box>

    
      <Box position="absolute" bottom="-3" left="-3" zIndex={1}>
        <Image src={CoinsmallR} alt="Mianus Token" boxSize={`${imgsize}px`} />
      </Box>
    </Box>
  );
}

function AboutSection() {
  
  const renderTicker = (position) => {
    const isTop = position === 'top';
    return (
      <Box
        position="absolute"
        left="50%"
        {...(isTop ? { top: 0 } : { bottom: 0 })}
        transform="translateX(-50%) scale(0.25)"
        transformOrigin={isTop ? 'top center' : 'bottom center'}
        w="400%"
        zIndex={1} 
        overflow="visible"
      >
        <CoinTickerRandom />
      </Box>
    );
  };

  return (
    <MotionBox
      id="about"
      {...fadeInUp}
      as="section"
      py={12}
      color="#FFFFFF"
    >
      <Container maxW="container.lg">
        <Flex alignItems="center" justifyContent="center" mb={8}>
          <Image src={CoinsmallR} alt="Mianus Token" boxSize="50px" mr={3} />
          <Heading
            as="h2"
            fontFamily="Slackey, cursive"
            fontWeight="bold"
            fontSize={{ base: '32px', md: '40px' }}
            lineHeight="40px"
            textTransform="uppercase"
            textShadow="2px 2px #2A3335"
            mb={2}
            textAlign="center"
          >
            Bet Mianus
          </Heading>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
     
          <Box>
            <Box textAlign="center" mb={8}>
              <Heading
                as="h3"
                fontFamily="Slackey, cursive"
                fontWeight="bold"
                fontSize="22px"
                lineHeight="32px"
                textShadow="2px 2px #2A3335"
                mb={4}
              >
                Full-Featured iGaming Application
              </Heading>
            </Box>
            <Image
              src={Betpreview}
              alt="Tap Mianus App"
              mx="auto"
              mb={8}
              maxW="200px"
              objectFit="contain"
              filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.9))"
            />
            <Box maxW={{ base: 'md', md: 'lg' }} mx="auto" textAlign="left">
              <Text
                fontFamily="Raleway, sans-serif"
                fontSize="18px"
                fontWeight="bold"
                color="#FFFFFF"
                mb={4}
              >
                <strong>Bet Mianus</strong> is a <strong>provably fair crypto gaming platform</strong> that
                lets you deposit, play, and withdraw using <strong>ETH</strong>, <strong>BASE</strong>,
                <strong>TRON</strong>, <strong>BSC</strong>, and <strong>SOLANA</strong>. The platform offers a
                comprehensive suite of Slots, Table Games, Crypto Games, and Sports Betting.
              </Text>
              <Text
                fontFamily="Raleway, sans-serif"
                fontSize="18px"
                fontWeight="bold"
                color="#FFFFFF"
                mb={4}
              >
                Backed by a team with long-standing experience in iGaming and GambleFi, our experts excel in
                hash games, on-chain betting, and provably fair gaming. They have also collaborated with some
                of the biggest names in the industry, including AG, KY Group, and BetConstruct.
              </Text>
              <Text
                fontFamily="Raleway, sans-serif"
                fontSize="18px"
                fontWeight="bold"
                color="#FFFFFF"
              >
                <strong>Bet Mianus revenue-sharing model:</strong> 100% of the Platform Gaming Revenue is
                distributed to <strong>Mianus Token</strong>.
              </Text>
            </Box>
          </Box>


<Box>
  <Heading
    as="h3"
    fontFamily="Slackey, cursive"
    fontWeight="bold"
    fontSize="22px"
    textTransform="uppercase"
    color="#FFFFFF"
    textShadow="1px 1px 0 #000"
    mb={4}
    textAlign="center"
  >
    Platform Revenue Sharing
  </Heading>

  <Flex
    direction={{ base: 'column', md: 'row' }}
    align="center"
    justify="center"
    gap={8}
    mb={12}
  >
  
    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #FF6F91, #FFBC42)"
    >
  
      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaDollarSign} />
      </Box>
   
      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        Platform Revenue
      </Heading>
  
      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        All revenue generated by the platform.
      </Text>
    </Box>

    <Animatedarrow />

 
    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #FFBC42, #FFD26F)"
    >
  
      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaHandHoldingUsd} />
      </Box>
 
      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        Staked $Mianus Holders
      </Heading>

      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        Receive 100% of platform revenue.
      </Text>
    </Box>
  </Flex>

  <Heading
    as="h3"
    fontFamily="Slackey, cursive"
    fontWeight="bold"
    fontSize="22px"
    textTransform="uppercase"
    color="#FFFFFF"
    textShadow="1px 1px 0 #000"
    mb={4}
    textAlign="center"
  >
    Platform Operations Funding
  </Heading>


  <Flex
    direction={{ base: 'column', md: 'row' }}
    align="center"
    justify="center"
    gap={8}
    mb={12}
  >
  
    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #42FFA1, #6FFFD2)"
    >
 
      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaChartPie} />
      </Box>

      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        20% Platform Stake
      </Heading>
   
      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        Reserved for operational funds.
      </Text>
    </Box>

    <Animatedarrow />

 
    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #6FFFD2, #B3FFEB)"
    >
  
      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaChartLine} />
      </Box>

      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        Operations &amp; Growth
      </Heading>

      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        Funds to develop and expand the platform.
      </Text>
    </Box>
  </Flex>


  <Heading
    as="h3"
    fontFamily="Slackey, cursive"
    fontWeight="bold"
    fontSize="22px"
    textTransform="uppercase"
    color="#FFFFFF"
    textShadow="1px 1px 0 #000"
    mb={4}
    textAlign="center"
  >
    Bet Mining
  </Heading>

  <Flex
    direction={{ base: 'column', md: 'row' }}
    align="center"
    justify="center"
    gap={8}
  >

    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #42A1FF, #6FD2FF)"
    >
 
      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaWaveSquare} />
      </Box>

      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        Bet Mining Algorithm
      </Heading>

      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        Ensures an ever-decreasing supply is mined each year.
      </Text>
    </Box>

    <Animatedarrow />

 
    <Box
      position="relative"
      w="250px"
      h="240px"
      p={3}
      border="2px solid #FFFFFF"
      borderRadius="md"
      overflow="hidden"
      bgGradient="linear(to-br, #6FD2FF, #B3EBFF)"
    >

      <Box position="absolute" top="16px" left="50%" transform="translateX(-50%)">
        <CombinedIcon BackgroundIcon={FaGem} />
      </Box>

      <Heading
        as="h2"
        fontSize="16px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="110px"
        left="50%"
        transform="translateX(-50%)"
        w="100%"
      >
        Earn $Mianus
      </Heading>

      <Text
        as="p"
        fontSize="14px"
        color="#FFFFFF"
        textAlign="center"
        textShadow="1px 1px 0 #000"
        position="absolute"
        top="150px"
        left="50%"
        transform="translateX(-50%)"
        w="80%"
      >
        For each qualifying bet you make.
      </Text>
    </Box>
  </Flex>
</Box>




        </SimpleGrid>

  
        <Box mt={8} textAlign="center">
          <Text fontFamily="Raleway, sans-serif" fontSize="16px" color="#FFFFFF">
            <strong>Note:</strong> All platform revenue is distributed to holders who stake $Mianus.
            Additionally, the platform stakes 20% of the total supply to secure operational funds.
          </Text>
        </Box>

   
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={8}
          mt={10}
          px={{ base: 4, md: 0 }}
        >

          <MotionBox
            position="relative"
            w="full"
            bg="rgba(255,255,255,0.1)"
            p={4}
            boxShadow="lg"
            flexDirection="column"
            align="center"
            whileHover={{ scale: 1.05 }}
            transition="all 0.3s ease-in-out"
          >
            {renderTicker('top')}
            {renderTicker('bottom')}
            <Image
              src={fair}
              alt="fair"
              w="100px"
              objectFit="cover"
              mt={12}
              mb={12}
            />
            <Heading
              as="h4"
              fontFamily="Slackey, cursive"
              fontSize="18px"
              mb={2}
              textShadow="1px 1px #2A3335"
            >
              Provably Fair
            </Heading>
            <Text mb={8} fontFamily="Raleway, sans-serif" fontSize="14px">
              Every bet, verifiable on-chain. No hidden house edges, just pure transparency.
            </Text>
          </MotionBox>

   
          <MotionBox
            position="relative"
            w="full"
            bg="rgba(255,255,255,0.1)"
            p={4}
            boxShadow="lg"
            flexDirection="column"
            align="center"
            whileHover={{ scale: 1.05 }}
            transition="all 0.3s ease-in-out"
          >
            {renderTicker('top')}
            {renderTicker('bottom')}
            <Image
              src={chains}
              alt="multichain"
              w="100px"
              objectFit="cover"
              mt={12}
              mb={12}
            />
            <Heading
              as="h4"
              fontFamily="Slackey, cursive"
              fontSize="18px"
              mb={2}
              textShadow="1px 1px #2A3335"
            >
              Multi-Chain
            </Heading>
            <Text mb={8} fontFamily="Raleway, sans-serif" fontSize="14px">
              Deposit in ETH, BASE, TRON, BSC, or SOL. Seamless cross-chain support with zero KYC.
            </Text>
          </MotionBox>

 
          <MotionBox
            position="relative"
            w="full"
            bg="rgba(255,255,255,0.1)"
            p={4}
            boxShadow="lg"
            flexDirection="column"
            align="center"
            whileHover={{ scale: 1.05 }}
            transition="all 0.3s ease-in-out"
          >
            {renderTicker('top')}
            {renderTicker('bottom')}
            <Image
              src={ggr}
              alt="ggr"
              w="100px"
              objectFit="cover"
              mt={12}
              mb={12}
            />
            <Heading
              as="h4"
              fontFamily="Slackey, cursive"
              fontSize="18px"
              mb={2}
              textShadow="1px 1px #2A3335"
            >
              100% GGR to You
            </Heading>
            <Text mb={8} fontFamily="Raleway, sans-serif" fontSize="14px">
              Grow with the house! Mianus Token holders share all gross gaming revenue—everyone wins together.
            </Text>
          </MotionBox>
        </SimpleGrid>
      </Container>
    </MotionBox>
  );
}

export default AboutSection;
