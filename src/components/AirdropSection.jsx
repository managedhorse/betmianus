// src/components/AirdropSection.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Image, 
  VStack,

} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTelegram } from 'react-icons/fa6';
import { keyframes } from '@emotion/react';
import Tapapp from '../images/tapapp.webp';
import Powerups from '../images/powerups.webp';
import PassiveIncome from '../images/passive2.png';
import Appgaming from '../images/appgaming.png';
import Refer from '../images/referfriend.png';
import Pointer from '../images/pointer.webp';


const MotionBox = motion.create(Box);
const MotionText = motion.create(Text);
const MotionImage = motion.create(Image);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const animatedGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


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

function AirdropSection() {
  return (
    
    <MotionBox
      id="airdrop"
      {...fadeInUp}
      as="section"
      py={12}
      minH="100vh"
      textAlign="center"
    >
      <Container maxW="container.md">
    
        <Heading
          as="h2"
          fontFamily="Slackey, cursive"
          fontWeight="bold"
          fontSize="40px"
          lineHeight="40px"
          textTransform="uppercase"
          color="#FFFFFF"
          textShadow="3px 3px #2A3335"
          mb={8}
        >
          $Mianus Airdrop
        </Heading>
        <Text
          fontFamily="Raleway, sans-serif"
          fontSize="18px"
          fontWeight="bold"
          color="#FFFFFF"
          mb={12}
        >
          Tap Mianus on{' '}
          <FaTelegram
            size={20}
            mb={8}
            color="#ffffff"
            style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}
          />
          Telegram to earn your airdrop!
        </Text>
  
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="center"
          mt={8}
          mb={8}
          gap={1}
        >
  
          
          <Box flex="1" mb={{ base: 4, md: 0 }}>
          <Heading
              as="h3"
              fontFamily="Slackey, cursive"
              fontSize="25px"
              color="#FFFFFF"
              mt={2}
              mb={4}
              textShadow="3px 3px #2A3335"
            >
              Tap Mianus Mini App
            </Heading>
            <Heading
              as="h3"
              fontFamily="Slackey, cursive"
              fontSize="15px"
              color="#FFFFFF"
              mt={2}
              mb={4}
              px={12}
              textAlign="center"
              textShadow="1px 1px #2A3335">
                We've allocated a generous portion of $Mianus for our players. We welcome everyone to partake in tapping Mianus
                </Heading>
                <Box as="a" href="https://t.me/TapMianusV2Bot" target="_blank" rel="noopener noreferrer" position="relative" display="inline-block">
              <MotionImage
                src={Tapapp}
                alt="Tap Mianus App"
                mx="auto"
                maxW="250px"
                objectFit="contain"
                filter="drop-shadow(0px 4px 6px rgba(255, 255, 255, 0.9))"
                whileHover={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
              <MotionImage
                src={Pointer}
                alt="Pointer indicating the image"
                position="absolute"
                top="130px"
                right="-40px"
                boxSize="80px"
                initial={{ rotate: 10, scale: 1 }}
                animate={{ rotate: [10, 20, 10] }}
                transition={{
                  duration: 0.2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            </Box>
            <Heading
              as="h3"
              fontFamily="Slackey, cursive"
              fontSize="15px"
              color="#FFFFFF"
              mt={4}
              mb={4}
              px={12}
              textAlign="center"
              textShadow="1px 1px #2A3335">
                Free to Play! Available exclusively on Telegram{' '}
          <FaTelegram
            size={20}
            mb={8}
            color="#ffffff"
            style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}
          /> Mobile App!
                </Heading>
          </Box>
 
          <VStack flex="1" spacing={6}>
            <Box position="relative" left="-50px">
              <MotionImage
                src={Powerups}
                alt="Powerups"
                mx="auto"
                maxW="200px"
                objectFit="contain"
                mb={2}
                animate={{ rotate: [-15, -10, -15, -10, -15,-10, -15, -10, -15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 2.1,
  }}
              />
              <MotionText
                fontFamily="Slackey"
                fontSize="16px"
                color="#FFFFFF"
                maxW="210px"
                animate={{ rotate: [-15, -10, -15, -10, -15,-10, -15, -10, -15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 2.1,
  }}
              >
                Boost your play with powerups.
              </MotionText>
            </Box>
            <Box position="relative" left="50px">
              <MotionImage
                src={PassiveIncome}
                alt="Passive Income"
                mx="auto"
                maxW="220px"
                objectFit="contain"
                mb={2}
                animate={{ rotate: [15, 10, 15, 10, 15,10, 15, 10, 15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 2.5,
  }}
              />
              <MotionText
                fontFamily="Slackey"
                fontSize="16px"
                color="#FFFFFF"
                maxW="210px"
                animate={{ rotate: [15, 10, 15, 10, 15,10, 15, 10, 15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 2.5,
  }}
              >
                Tap bots earn while you sleep.
              </MotionText>
            </Box>
            <Box position="relative" left="-50px">
              <MotionImage
                src={Appgaming}
                alt="In-App Gaming"
                mx="auto"
                maxW="200px"
                objectFit="contain"
                mb={2}
                animate={{ rotate: [-15, -10, -15, -10, -15,-10, -15, -10, -15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 1.9,
  }}
              />
              <MotionText
                fontFamily="Slackey"
                fontSize="16px"
                color="#FFFFFF"
                maxW="210px"
                animate={{ rotate: [-15, -10, -15, -10, -15,-10, -15, -10, -15] }}
  transition={{
    duration: 0.5,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 1.9,
  }}
              >
                Play and win exciting games!
              </MotionText>
            </Box>
            <Box position="relative" left="50px">
              <MotionImage
                src={Refer}
                alt="Refer"
                mx="auto"
                maxW="210px"
                objectFit="contain"
                mb={2}
                animate={{ rotate: [15, 10, 15, 10, 15,10, 15, 10, 15] }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
              <MotionText
                fontFamily="Slackey"
                fontSize="16px"
                color="#FFFFFF"
                maxW="210px"
                animate={{ rotate: [15, 10, 15, 10, 15,10, 15, 10, 15] }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                Refer your friends for bonuses and get 10% of their taps as income!
              </MotionText>
            </Box>
          </VStack>
        </Flex>
        <Flex justify="center">
        <Button
  as="a"
  href="https://t.me/TapMianusV2Bot"
  target="_blank"
  rel="noopener noreferrer"
  px={{ base: '6', md: '8' }}
  py={{ base: '8', md: '8' }}
  mt={8}
  fontFamily="Slackey, cursive"
  fontSize={{ base: '18px', md: '20px' }}
  fontWeight="normal"
  bgGradient="linear(to-r, #FF6F91, #FFBC42)"
  backgroundSize="200% 200%"
  animation={`${animatedGradient} 1s ease infinite`}
  border="2px solid #2A3335"
  color="#FFFFFF"
  textShadow="2px 2px #2A3335"
  rounded="md"
  boxShadow="md"
  whiteSpace="normal"
  maxW={{ base: '300px', md: 'auto' }}
  textAlign="center"
  {...buttonHoverStyle}
>
  Open Tap Mianus in Telegram
</Button>

        </Flex>
      </Container>
    </MotionBox>
  );
}

export default AirdropSection;
