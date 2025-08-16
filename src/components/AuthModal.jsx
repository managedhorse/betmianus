// src/components/AuthModal.jsx
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

const dark = '#2A3335';
const panelBgLogin = 'gray.50';   // subtle gray for Log in
const panelBgSignup = '#fff5f8';  // very light pink for Sign up

// Shared field/button styles (not all-pink)
const inputStyle = {
  bg: 'white',
  border: `2px solid ${dark}`,
  _focus: { borderColor: '#FF6F91', boxShadow: 'none' },
};

const buttonStyle = {
  bg: 'white',
  border: `2px solid ${dark}`,
  _hover: { bg: 'gray.50', transform: 'translateY(-1px)' },
};

export default function AuthModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0=Log in, 1=Sign up

  // Close the modal once a session exists
  useEffect(() => { if (isOpen && user) onClose(); }, [isOpen, user, onClose]);

  const [msg, setMsg] = useState('');
  useEffect(() => { if (isOpen) setMsg(''); }, [isOpen]);

  // Individual spinners
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmailIn, setLoadingEmailIn] = useState(false);
  const [loadingEmailUp, setLoadingEmailUp] = useState(false);
  const [loadingNickIn, setLoadingNickIn] = useState(false);
  const [loadingNickUp, setLoadingNickUp] = useState(false);

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
          <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required {...inputStyle}/>
          <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required {...inputStyle}/>
          <Button type="submit" isLoading={loadingEmailIn} {...buttonStyle}>Log in</Button>
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
          <Input placeholder="Nickname" value={username} onChange={(e)=>setUsername(e.target.value)} required {...inputStyle}/>
          <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required {...inputStyle}/>
          <Button type="submit" isLoading={loadingNickIn} {...buttonStyle}>Log in with nickname</Button>
        </VStack>
      </form>
    );
  };

  // EMAIL SIGN UP: email + password only
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
        email, password,
        options: { emailRedirectTo: window.location.origin },
      });
      setMsg(error ? error.message : 'Check your email to confirm your account.');
      setLoadingEmailUp(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required {...inputStyle}/>
          <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required {...inputStyle}/>
          <Checkbox isChecked={agree} onChange={(e)=>setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loadingEmailUp} {...buttonStyle}>Create account</Button>
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
          <Input placeholder="Nickname (3–20 letters/numbers/_)" value={username} onChange={(e)=>setUsername(e.target.value)} required {...inputStyle}/>
          <Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required {...inputStyle}/>
          <Checkbox isChecked={agree} onChange={(e)=>setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loadingNickUp} {...buttonStyle}>Create nickname account</Button>
        </VStack>
      </form>
    );
  };

  // Tab button styling (actual tab look: flat bottom, grayed inactive)
  const tabSx = (isActive) => ({
    px: 6,
    py: 3,
    fontWeight: 'bold',
    roundedTop: 'md',
    roundedBottom: 'none',
    border: `2px solid ${dark}`,
    borderBottom: '0',
    bg: isActive ? 'white' : 'gray.200',
    color: isActive ? 'black' : 'gray.600',
    _hover: { bg: isActive ? 'white' : 'gray.300' },
  });

  const Card = ({ bg, children }) => (
    <Box border={`2px solid ${dark}`} roundedBottom="md" p={4} bg={bg}>
      {children}
    </Box>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs index={activeTab} onChange={setActiveTab} isFitted variant="unstyled">
            <TabList borderBottom={`2px solid ${dark}`} mb="0">
              <Tab sx={tabSx(activeTab === 0)}>Log in</Tab>
              <Tab sx={tabSx(activeTab === 1)}>Sign up</Tab>
            </TabList>

            <TabPanels>
              {/* LOG IN */}
              <TabPanel px={0}>
                <Card bg={panelBgLogin}>
                  <VStack align="stretch" spacing={4}>
                    <Button onClick={google} isLoading={loadingGoogle} {...buttonStyle}>
                      Continue with Google
                    </Button>
                    <HStack><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                    <Tabs isFitted variant="unstyled">
                      <TabList borderBottom={`1px solid ${dark}`}>
                        <Tab sx={tabSx(true)} borderWidth="1px" borderBottom="0" roundedTop="sm">Email</Tab>
                        <Tab sx={tabSx(false)} borderWidth="1px" borderBottom="0" roundedTop="sm" ml={2}>Nickname</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel px={0}><EmailSignIn /></TabPanel>
                        <TabPanel px={0}><NicknameSignIn /></TabPanel>
                      </TabPanels>
                    </Tabs>
                  </VStack>
                </Card>
              </TabPanel>

              {/* SIGN UP */}
              <TabPanel px={0}>
                <Card bg={panelBgSignup}>
                  <VStack align="stretch" spacing={4}>
                    <Button onClick={google} isLoading={loadingGoogle} {...buttonStyle}>
                      Continue with Google
                    </Button>
                    <HStack><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                    <Tabs isFitted variant="unstyled">
                      <TabList borderBottom={`1px solid ${dark}`}>
                        <Tab sx={tabSx(true)} borderWidth="1px" borderBottom="0" roundedTop="sm">Email</Tab>
                        <Tab sx={tabSx(false)} borderWidth="1px" borderBottom="0" roundedTop="sm" ml={2}>Nickname</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel px={0}><EmailSignUp /></TabPanel>
                        <TabPanel px={0}><NicknameSignUp /></TabPanel>
                      </TabPanels>
                    </Tabs>
                  </VStack>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {msg && <Text mt={3} fontSize="sm" opacity={0.9}>{msg}</Text>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
