import React, { useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Image,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaTelegram, FaXTwitter } from 'react-icons/fa6';
import coinSmallR from '../images/coinsmallR.webp';
import { useAppKitAccount } from '@reown/appkit/react';
import CustomConnectButton from './CustomConnectButton';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

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

const NavLink = ({ children, href }) => (
  <Link
    href={href}
    position="relative"
    px={3}
    py={1}
    whiteSpace="nowrap"
    fontWeight="medium"
    fontFamily="Slackey, cursive"
    color="white"
    textShadow="2px 2px #2A3335"
    transition="all 0.3s ease-in-out"
    _after={{
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      bgGradient: 'linear(to-r, rgba(255,111,145,0.4), rgba(255,188,66,0.4))',
      clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
      zIndex: -1,
      borderRadius: 'md',
    }}
    _hover={{
      textDecoration: 'none',
      color: 'white',
      transform: 'translateY(-3px) scale(1.05)',
      _after: { opacity: 1 },
    }}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();           // drawer
  const { isOpen: authOpen, onOpen: openAuth, onClose: closeAuth } = useDisclosure(); // auth modal

  useEffect(() => {
  const hash = new URLSearchParams(window.location.hash.slice(1));
  if (hash.get('type') === 'recovery') {
    openAuth();
    // optional: clear hash so refresh/back doesn’t re-trigger
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}, [openAuth]);

  const { user, profile, signOut } = useAuth();
  const { isConnected } = useAppKitAccount();

  const navItems = [
    { label: 'Airdrop', href: '#airdrop' },
    { label: 'Tokenomics', href: '#tokenomics' },
    { label: 'About', href: '#about' },
    { label: 'Casino', href: '#casino' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <Box position="fixed" top="0" w="full" bg="#ffbed9" zIndex="1000" boxShadow="md">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
          maxW="container.xl"
          mx="auto"
          px={4}
        >
          <HStack spacing={2} alignItems="center">
            <Image src={coinSmallR} alt="Mianus Token Logo" boxSize="40px" />
            <Box
              fontFamily="Slackey, cursive"
              fontSize="xl"
              whiteSpace="nowrap"
              color="white"
              textShadow="2px 2px #2A3335"
              display={{ base: 'none', md: 'block' }}
              textTransform="uppercase"
            >
              Bet Mianus
            </Box>
          </HStack>

          <HStack spacing={4} flex={1} justify="center" display={{ base: 'none', md: 'flex' }}>
            {navItems.map((navItem) => (
              <NavLink key={navItem.label} href={navItem.href}>
                {navItem.label}
              </NavLink>
            ))}
          </HStack>

          <HStack spacing={4}>
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link href="https://x.com/tapmianus" isExternal>
                <FaXTwitter size={20} color="black" />
              </Link>
              <Link href="https://t.me/tapmianus" isExternal>
                <FaTelegram size={20} color="#0088cc" />
              </Link>
            </HStack>

            {isConnected && (
              <>
                <appkit-network-button disabled={false} size="sm" />
              </>
            )}

            <CustomConnectButton />

           {/* Auth control (force remount on user change) */}
<React.Fragment key={user?.id || 'anon'}>
  {user ? (
    <Menu>
      <MenuButton as={Button} variant="ghost" px={1}>
        <HStack>
          <Avatar size="sm" name={profile?.username || user?.email || 'User'} />
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem isDisabled>
          {profile?.username ? `@${profile.username}` : (user?.email || 'Signed in')}
        </MenuItem>
        <MenuItem isDisabled>
          {profile?.public_id ? `UID #${profile.public_id}` : 'UID pending'}
        </MenuItem>
        <MenuItem as="a" href="/logout">Sign out</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button
      onClick={openAuth}
      bgGradient="linear(to-r, #FFCFEF, #FFCFEF)"
      border="2px solid #2A3335"
      color="#2A3335"
      _hover={{ transform: 'translateY(-3px)' }}
    >
      Login / Sign up
    </Button>
  )}
</React.Fragment>

            <IconButton
              aria-label="Open Menu"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              {...buttonHoverStyle}
              bgGradient={basePinkGradient}
              border="2px solid #2A3335"
              color="#FFFFFF"
              textShadow="2px 2px #2A3335"
              rounded="md"
              transition="all 0.2s ease-in-out"
              _focus={{ boxShadow: 'outline' }}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Auth modal */}
      <AuthModal isOpen={authOpen} onClose={closeAuth} />

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="#ffbed9">
          <DrawerCloseButton
            {...buttonHoverStyle}
            bgGradient={basePinkGradient}
            border="2px solid #2A3335"
            color="#FFFFFF"
            textShadow="2px 2px #2A3335"
            rounded="md"
            top="4"
            right="4"
            _focus={{ boxShadow: 'outline' }}
          />
          <DrawerHeader
            fontFamily="Slackey, cursive"
            fontSize="xl"
            color="white"
            textShadow="2px 2px #2A3335"
            textTransform="uppercase"
          >
            Bet Mianus
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {navItems.map((navItem) => (
                <NavLink key={navItem.label} href={navItem.href}>
                  {navItem.label}
                </NavLink>
              ))}
              <HStack spacing={4}>
                <Link href="https://x.com/tapmianus" isExternal>
                  <FaXTwitter size={20} color="black" />
                </Link>
                <Link href="https://t.me/tapmianus" isExternal>
                  <FaTelegram size={20} color="#0088cc" />
                </Link>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
