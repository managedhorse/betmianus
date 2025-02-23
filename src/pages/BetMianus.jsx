// src/pages/BetMianus.jsx
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Button,
  Container,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import ProviderTicker from '../components/ProviderTicker';
import CoinTickerRandom from '../components/CoinTicker';
import FAQ from '../components/FAQ';
import Navbar from '../components/Navbar';
import Airdropsection from '../components/AirdropSection';
import TokenomicsSection from '../components/TokenomicsSection';
import CoinsmallR from '../images/coinsmallR.webp';
import CoinsmallopenR from '../images/coinsmall-openR.webp';
import Pointer from '../images/pointer.webp';
import Airdropbanner from '../images/airdropbanner.webp';
import MianusHero from '../images/mianushero.webp';
import Aboutsection from '../components/AboutSection'
import Casinosection from '../components/CasinoSection';
import Tokeninfosection from '../components/TokenInfoSection';

const MotionBox = motion.create(Box);
const MotionImage = motion.create(Image);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};


const formatNumber = (num) => {
  if (num < 1000) return new Intl.NumberFormat().format(num);
  else if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  else return (num / 1000000).toFixed(1) + 'M';
};

const basePinkGradient = "linear(to-r, #FFCFEF, #FFCFEF)";
const buttonHoverStyle = {
  transitionProperty: "transform, background-image",
  transitionDuration: "0.2s, 0.8s",
  transitionTimingFunction: "ease-in-out, ease-in-out",
  _hover: {
    transform: "translateY(-3px)",
    bgGradient: "linear(to-r, #FF6F91, #FFBC42)",
    color: "#FFFFFF",
    border: "2px solid #2A3335",
  },
};

function TitleWithCoin() {
  const [hovered, setHovered] = useState(false);

  return (
    <Flex
      align="center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      mb={4}
    >
      <MotionImage
        src={hovered ? CoinsmallopenR : CoinsmallR}
        alt="Coin Icon"
        boxSize="50px"
        mr={2}
        animate={hovered ? { y: [0, -5, 0, 5, 0] } : { y: 0 }}
        transition={{ duration: 0.3, repeat: hovered ? Infinity : 0, ease: "easeInOut" }}
      />
      <Heading
        as="h1"
        fontFamily="Slackey, cursive"
        fontWeight="bold"
        fontSize={{ base: '28px', md: '38px' }}
        lineHeight="1.2"
        textTransform="uppercase"
        color="#FFFFFF"
        textShadow="2px 2px #2A3335"
      >
        $Mianus
      </Heading>
    </Flex>
  );
}

const BetMianus = () => {
  return (
    <>
      <Navbar />
      <Box pt={16} w="full" position="relative" bgGradient="linear(to-br, #0A5EB0, #0A97B0)" color="#FFFFFF">
        <Box position="relative" zIndex={1} >
      
          <MotionBox
            {...fadeInUp}
            as="section"
            minH="calc(100vh - 64px)"
            display="flex"
            flexDir="column"
            
          >
            <Box flex="1" mt={{ base: '16', md: '20' }}>
              <Container maxW="container.lg" >
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                  justify="space-between"
                >
                  <Box
                    flex="1"
                    display="flex"
                    justifyContent="center"
                    mb={{ base: 5, md: 10 }}
                    mt={{ base: 10, md: 20 }}
                    position="relative"
                  >
                    <MotionImage
                      src={MianusHero}
                      alt="Bet Mianus App"
                      maxH={{ base: '250px', md: '350px' }}
                      objectFit="contain"
                      borderRadius="md"
                      animate={{
                        filter: [
                          'drop-shadow(0px 0px 2px rgba(255,255,255,0.8))',
                          'drop-shadow(0px 0px 10px rgba(255,255,255,0.8))',
                          'drop-shadow(0px 0px 2px rgba(255,255,255,0.8))',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeInOut',
                        repeat: Infinity,
                      }}
                    />
                    <MotionImage
                      src={Airdropbanner}
                      alt="Airdrop Banner"
                      position="absolute"
                      top={{ base: "-50px", md: "-70px" }}
                      left={{ base: "-30px", md: "-50px" }}
                      width={{ base: "190px", md: "350px" }}
                      height="auto"
                      initial={{ rotate: -15 }}
                      animate={{ rotate: [-15, -10, -15, -10, -15, -10, -15, -10, -15] }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2.5,
                      }}
                      opacity={1}
                    />
                  </Box>
                  <Box flex="1" pl={{ md: 10 }}>
                    <TitleWithCoin />
                    <Heading
                      as="h2"
                      fontFamily="Slackey, cursive"
                      fontWeight="bold"
                      fontSize={{ base: '20px', md: '30px' }}
                      lineHeight="1.3"
                      color="#FFFFFF"
                      textShadow="2px 2px #2A3335"
                      mb={6}
                    >
                      Plunge into Mianus for endless thrills and instant crypto wins!
                    </Heading>
                    <Flex gap={4}>
                    <Tooltip label="Coming soon" hasArrow>
  <Button
    isDisabled
    {...buttonHoverStyle}
    fontFamily="Slackey, cursive"
    fontSize="18px"
    bgGradient={basePinkGradient}
    border="2px solid #2A3335"
    color="#FFFFFF"
    textShadow="2px 2px #2A3335"
    rounded="md"
    as="a"
    href="#howtobuy"
    _disabled={{
      opacity: 0.7,
      cursor: "not-allowed",
      bgGradient: basePinkGradient, 
    }}
  >
    Buy Now
  </Button>
</Tooltip>
                      <Box position="relative" display="inline-block">
                        <Button
                          {...buttonHoverStyle}
                          fontFamily="Slackey, cursive"
                          fontSize="18px"
                          bgGradient={basePinkGradient}
                          border="2px solid #2A3335"
                          color="#FFFFFF"
                          textShadow="2px 2px #2A3335"
                          rounded="md"
                          as="a"
                          href="#airdrop"
                          px="6"
                          py="4"
                        >
                          Airdrop Now
                        </Button>
                        <MotionImage
                          src={Pointer}
                          alt="Pointer indicating the button"
                          position="absolute"
                          top="-20px"
                          right="-30px"
                          boxSize="48px"
                          initial={{ rotate: 10, scale: 1 }}
                          animate={{
                            rotate: [10, 20, 10],
                            scale: [1, 1.0625, 1],
                          }}
                          transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                            repeat: Infinity,
                          }}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </Container>
            </Box>
            <Box mt="auto">
              <CoinTickerRandom />
            </Box>
          </MotionBox>

          <Airdropsection />
           <Tokeninfosection />
          <TokenomicsSection />
          <Aboutsection />
          <ProviderTicker />
          <Casinosection />
            <FAQ />

            <Box as="footer" w="full" py="4" bg="#0A5EB0" color="#FFFFFF" textAlign="center">
              <Text
                fontSize="sm"
                fontFamily="Raleway, sans-serif"
                fontWeight="medium"
                textShadow="1px 1px #2A3335"
              >
                © {new Date().getFullYear()} Bet Mianus. All rights reserved.
              </Text>
            </Box>
          </Box>
     </Box>
    </>
  );
};

export default BetMianus;
