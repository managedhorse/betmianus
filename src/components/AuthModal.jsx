// src/components/AuthModal.jsx (Chakra v2)
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

  // Close when user becomes authenticated
  useEffect(() => {
    if (isOpen && user) onClose();
  }, [isOpen, user, onClose]);

  // messaging + loading states
  const [msg, setMsg] = useState('');
  useEffect(() => { if (isOpen) setMsg(''); }, [isOpen]);

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmailIn, setLoadingEmailIn] = useState(false);
  const [loadingEmailUp, setLoadingEmailUp] = useState(false);
  const [loadingNickIn, setLoadingNickIn] = useState(false);
  const [loadingNickUp, setLoadingNickUp] = useState(false);

  // which root tab (0: login, 1: signup)
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

  // ---------- Forms (components) ----------
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
          <Input type="email" placeholder="Email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
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
          <Input placeholder="Nickname" value={username}
                 onChange={(e) => setUsername(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" isLoading={loadingNickIn}>Log in with nickname</Button>
        </VStack>
      </form>
    );
  };

  const EmailSignUp = () => {
    // Email sign-up: email + password ONLY (no nickname)
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
          <Input type="email" placeholder="Email" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
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
          <Input placeholder="Nickname (3–20 letters/numbers/_)" value={username}
                 onChange={(e) => setUsername(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
          <Checkbox isChecked={agree} onChange={(e) => setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loadingNickUp}>Create nickname account</Button>
        </VStack>
      </form>
    );
  };

  // Style helpers to make mode obvious
  const panelBg   = rootIndex === 0 ? 'gray.50' : 'pink.50';
  const panelBord = rootIndex === 0 ? 'gray.300' : 'pink.200';
  const rootScheme = rootIndex === 0 ? 'gray' : 'pink';

  const tabBase = {
    fontWeight: 'semibold',
    borderColor: 'gray.300',
    borderBottom: 'none',
    borderTopRadius: 'md',
    _selected: {
      bg: 'white',
      borderColor: rootIndex === 0 ? 'gray.300' : 'pink.300',
      borderBottomColor: 'transparent',
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {/* ROOT TABS: Login / Signup */}
          <Tabs
            index={rootIndex}
            onChange={setRootIndex}
            variant="enclosed"
            colorScheme={rootScheme}
            isFitted
          >
            <TabList>
              <Tab {...tabBase}>Log in</Tab>
              <Tab {...tabBase}>Sign up</Tab>
            </TabList>

            <TabPanels
              borderWidth="1px"
              borderTopWidth="0"
              borderColor={panelBord}
              bg={panelBg}
              p={5}
              rounded="md"
            >
              {/* LOGIN */}
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Button onClick={google} isLoading={loadingGoogle} variant="outline">
                    Continue with Google
                  </Button>
                  <HStack align="center"><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                  {/* inner tabs */}
                  <Tabs variant="enclosed" colorScheme="gray" isFitted>
                    <TabList>
                      <Tab fontWeight="semibold">Email</Tab>
                      <Tab fontWeight="semibold">Nickname</Tab>
                    </TabList>
                    <TabPanels borderWidth="1px" borderTopWidth="0" borderColor="gray.300" bg="white" p={4} rounded="md">
                      <TabPanel><EmailSignIn /></TabPanel>
                      <TabPanel><NicknameSignIn /></TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </TabPanel>

              {/* SIGN UP */}
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Button onClick={google} isLoading={loadingGoogle} variant="outline">
                    Continue with Google
                  </Button>
                  <HStack align="center"><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                  {/* inner tabs */}
                  <Tabs variant="enclosed" colorScheme="pink" isFitted>
                    <TabList>
                      <Tab fontWeight="semibold">Email</Tab>
                      <Tab fontWeight="semibold">Nickname</Tab>
                    </TabList>
                    <TabPanels borderWidth="1px" borderTopWidth="0" borderColor="pink.200" bg="white" p={4} rounded="md">
                      <TabPanel><EmailSignUp /></TabPanel>
                      <TabPanel><NicknameSignUp /></TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {msg && (
            <Box mt={3}>
              <Text fontSize="sm" opacity={0.9}>{msg}</Text>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
