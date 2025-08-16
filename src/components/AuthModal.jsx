// src/components/AuthModal.jsx  (Chakra v2)
import { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Button, Input, VStack, Text, Checkbox, HStack, Divider, Box
} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

async function postJSON(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}

export default function AuthModal({ isOpen, onClose }) {
  const { user } = useAuth();

  // Auto-close when signed in
  useEffect(() => { if (isOpen && user) onClose(); }, [isOpen, user, onClose]);

  const [msg, setMsg] = useState('');
  useEffect(() => { if (isOpen) setMsg(''); }, [isOpen]);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmailIn, setLoadingEmailIn] = useState(false);
  const [loadingEmailUp, setLoadingEmailUp] = useState(false);
  const [loadingNickIn, setLoadingNickIn] = useState(false);
  const [loadingNickUp, setLoadingNickUp] = useState(false);

  const [rootIndex, setRootIndex] = useState(0);

  const google = async () => {
    setMsg('');
    setLoadingGoogle(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setMsg(error.message);
    setLoadingGoogle(false);
  };

  // ---------- Forms ----------
  const EmailSignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submit = async (e) => {
      e.preventDefault();
      setMsg('');
      setLoadingEmailIn(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      setLoadingEmailIn(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Button type="submit" isLoading={loadingEmailIn}>Log in</Button>
        </VStack>
      </form>
    );
  };

  const NicknameSignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const submit = async (e) => {
      e.preventDefault();
      setMsg('');
      setLoadingNickIn(true);
      try {
        const session = await postJSON('/api/login-username', { username, password });
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      } catch (err) {
        setMsg(err.message);
      }
      setLoadingNickIn(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input
            placeholder="Nickname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Button type="submit" isLoading={loadingNickIn}>Log in with nickname</Button>
        </VStack>
      </form>
    );
  };

  // Email sign-up: email + password only
  const EmailSignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const submit = async (e) => {
      e.preventDefault();
      setMsg('');
      if (!agree) { setMsg('Please confirm you are 18+ and accept the Terms.'); return; }
      setLoadingEmailUp(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setMsg(error ? error.message : 'Check your email to confirm your account.');
      setLoadingEmailUp(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Checkbox isChecked={agree} onChange={(e) => setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loadingEmailUp}>Create account</Button>
        </VStack>
      </form>
    );
  };

  const NicknameSignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const submit = async (e) => {
      e.preventDefault();
      setMsg('');
      if (!agree) { setMsg('Please confirm you are 18+ and accept the Terms.'); return; }
      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
        setMsg('Nickname must be 3–20 characters: letters, numbers, underscore.');
        return;
      }
      setLoadingNickUp(true);
      try {
        await postJSON('/api/signup-nickname', { username, password });
        setMsg('Account created. You can now log in with your nickname.');
      } catch (err) {
        setMsg(err.message);
      }
      setLoadingNickUp(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input
            placeholder="Nickname (3–20 letters/numbers/_)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            bg="white"
            borderColor="gray.400"
            _placeholder={{ color: 'gray.500' }}
            _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
          />
          <Checkbox isChecked={agree} onChange={(e) => setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loadingNickUp}>Create nickname account</Button>
        </VStack>
      </form>
    );
  };

  // Root tabs: no colored strokes, no focus ring; clear active/inactive
  const tabClean = {
    fontWeight: 'semibold',
    bg: 'transparent',
    color: 'gray.700',
    border: '0',
    roundedTop: 'md',
    _hover: { bg: 'gray.100' },
    _selected: { bg: 'white', color: 'gray.900' },
    _focus: { boxShadow: 'none' },
    _focusVisible: { boxShadow: 'none', outline: 'none' },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">
          Account
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <Tabs
            index={rootIndex}
            onChange={setRootIndex}
            variant="enclosed"
            isFitted
          >
            <TabList border="0" mb={0}>
              <Tab {...tabClean}>Log in</Tab>
              <Tab {...tabClean}>Sign up</Tab>
            </TabList>

            {/* High-contrast, white content card */}
            <TabPanels
              borderWidth="1px"
              borderColor="gray.300"
              rounded="md"
              bg="white"
              p={5}
              mt={0}
            >
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Button
                    onClick={google}
                    isLoading={loadingGoogle}
                    variant="outline"
                    borderColor="gray.400"
                    _hover={{ bg: 'gray.50' }}
                    _focus={{ boxShadow: 'none' }}
                  >
                    Continue with Google
                  </Button>

                  <HStack align="center">
                    <Divider />
                    <Text color="gray.600">or</Text>
                    <Divider />
                  </HStack>

                  {/* inner tabs: subtle underline indicator */}
                  <Tabs variant="line" colorScheme="gray" isFitted>
                    <TabList>
                      <Tab fontWeight="semibold" _focus={{ boxShadow: 'none' }}>Email</Tab>
                      <Tab fontWeight="semibold" _focus={{ boxShadow: 'none' }}>Nickname</Tab>
                    </TabList>
                    <TabPanels pt={4}>
                      <TabPanel px={0}><EmailSignIn /></TabPanel>
                      <TabPanel px={0}><NicknameSignIn /></TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Button
                    onClick={google}
                    isLoading={loadingGoogle}
                    variant="outline"
                    borderColor="gray.400"
                    _hover={{ bg: 'gray.50' }}
                    _focus={{ boxShadow: 'none' }}
                  >
                    Continue with Google
                  </Button>

                  <HStack align="center">
                    <Divider />
                    <Text color="gray.600">or</Text>
                    <Divider />
                  </HStack>

                  <Tabs variant="line" colorScheme="gray" isFitted>
                    <TabList>
                      <Tab fontWeight="semibold" _focus={{ boxShadow: 'none' }}>Email</Tab>
                      <Tab fontWeight="semibold" _focus={{ boxShadow: 'none' }}>Nickname</Tab>
                    </TabList>
                    <TabPanels pt={4}>
                      <TabPanel px={0}><EmailSignUp /></TabPanel>
                      <TabPanel px={0}><NicknameSignUp /></TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {msg && (
            <Box mt={3}>
              <Text fontSize="sm" color="gray.800">{msg}</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
