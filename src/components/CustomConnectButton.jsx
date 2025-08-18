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

export default function CustomConnectButton({
  alwaysDisabled = false,
  label = 'Web3',
}) {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();

  // Force the disabled “coming soon” button (used in Auth modal)
  if (alwaysDisabled) {
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
          _disabled={{ opacity: 0.7, cursor: 'not-allowed' }}
        >
          {label}
        </Button>
      </Tooltip>
    );
  }

  // Default behavior (Navbar): if not connected, show nothing; if connected, show “Manage Wallet”
  if (!isConnected) return null;

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
