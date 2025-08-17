// src/components/CustomConnectButton.jsx
import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

const basePinkGradient = 'linear(to-r, #FFCFEF, #FFCFEF)';
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

export default function CustomConnectButton() {
  const { open } = useAppKit();      
  const { isConnected } = useAppKitAccount(); 

  if (!isConnected) {

    return (
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
        onClick={() => open()}
        _disabled={{
            opacity: 0.7,
            cursor: 'not-allowed',
        }}
      >
        Web3
      </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      {...buttonHoverStyle}
      fontFamily="Slackey, cursive"
      fontSize="18px"
      bgGradient={basePinkGradient}
      border="2px solid #2A3335"
      color="#FFFFFF"
      textShadow="2px 2px #2A3335"
      rounded="md"
      onClick={() => open()}
    >
      Manage Wallet
    </Button>
  );
}
