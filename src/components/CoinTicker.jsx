// src/components/CoinTickerRandom.jsx
import React, { useMemo } from 'react';
import Marquee from 'react-fast-marquee';
import { Box, Image, keyframes } from '@chakra-ui/react';

import Coinsmall from '../images/coinsmall.webp';
import CoinsmallR from '../images/coinsmallR.webp';
import CoinsmallopenR from '../images/coinsmall-openR.webp';
import Coinsmallopen from '../images/coinsmall-open.webp';
import Telegram from '../images/telegram.webp';
import Website from '../images/website.webp';
import Twitter from '../images/twitter.webp';
import Trx from '../images/trx.webp';
import Bitcoin from '../images/bitcoin.webp';
import Ethereum from '../images/ethereum.webp';
import Doge from '../images/dogecoin.webp';
import Bnb from '../images/bnb.webp';
import Tether from '../images/tether.webp';
import Usdc from '../images/usdc.webp';
import Solana from '../images/solana.webp';
import Toncoin from '../images/toncoin.webp';
import Pepe from '../images/pepe.webp';


const bobbleKeyframes = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;


const rollKeyframes = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`;

const CoinTickerRandom = () => {
  const allCoins = [
    Coinsmall,
    CoinsmallR,
    CoinsmallopenR,
    Coinsmallopen,
    Telegram,
    Website,
    Twitter,
    Bitcoin,
    Ethereum,
    Doge,
    Bnb,
    Tether,
    Usdc,
    Solana,
    Trx,
    Toncoin,
    Pepe,
  ];

  const randomCoins = useMemo(() => {
    const picks = [];
    for (let i = 0; i < 30; i++) {
      const coinIndex = Math.floor(Math.random() * allCoins.length);
      const coinSrc = allCoins[coinIndex];


      const isBobble = Math.random() < 0.5;


      const delay = (Math.random() * 2).toFixed(2);

      if (isBobble) {
        const duration = (0.2 + Math.random() * 1.5).toFixed(2);
        picks.push({
          src: coinSrc,
          animation: `${bobbleKeyframes} ${duration}s ease-in-out infinite`,
          animationdelay: `${delay}s`,
          transformOrigin: 'bottom center',
        });
      } else {
        const duration = (2 + Math.random() * 2).toFixed(2);
        picks.push({
          src: coinSrc,
          animation: `${rollKeyframes} ${duration}s linear infinite`,
          animationdelay: `${delay}s`,
          transformOrigin: 'center center',
        });
      }
    }
    return picks;
  }, [allCoins]);

  return (
    <Box  
      position="relative"
      py={0}
      overflowX="hidden"
      overflowY="visible"
      w="full"
      minH="100px"
    >
      <Marquee
        speed={60}
        gradient={false}
        pauseOnHover={false}
        style={{
          width: '100%',
          overflow: 'visible', 
          minHeight: '80px',
        }}
      >
        {randomCoins.map((coin, idx) => (
          <Box
            key={idx}
            mx={6}
            display="flex"
            alignItems="flex-end"
            overflow="visible"
          >
            <Image
  src={coin.src}
  alt={`Coin ${idx}`}
  boxSize="40px"
  objectFit="contain"
  style={{
    transformOrigin: coin.transformOrigin,
    filter: 'drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.8))'
  }}
  animation={coin.animation}
  animationdelay={coin.animationdelay}
/>
          </Box>
        ))}
      </Marquee>
    </Box>
  );
};

export default CoinTickerRandom;
