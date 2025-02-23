// src/components/ProviderTicker.jsx
import React from 'react';
import Marquee from 'react-fast-marquee';
import { Box, Image } from '@chakra-ui/react';

import spribe from '../images/spribe.webp';
import evolution from '../images/evolution.webp';
import pgSoft from '../images/pg-soft.webp';
import asiaGaming from '../images/asia-gaming.webp';
import betconstruct from '../images/betconstruct.webp';
import fbastrds from '../images/fbastards.webp';
import boss88 from '../images/boss88.webp';

const ProviderTicker = () => {
  const logos = [
    spribe,
    evolution,
    pgSoft,
    asiaGaming,
    betconstruct,
    fbastrds,
    boss88,
  ];

  return (
    <Box bg="#FFFFFF" py={4}>
      <Marquee speed={40} gradient={false} pauseOnHover={true}>
        {logos.map((logoSrc, idx) => (
          <Box key={idx} mx={6}>
            <Image
              src={logoSrc}
              alt={`Provider Logo ${idx}`}
              h="50px"
              objectFit="contain"
            />
          </Box>
        ))}
      </Marquee>
    </Box>
  );
};

export default ProviderTicker;
