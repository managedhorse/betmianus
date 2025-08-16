import { useEffect, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Button, Input, VStack, Text, Checkbox, HStack, Divider, Box, Tabs
} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// tiny helper for our nickname endpoints
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

  // close when auth succeeds
  useEffect(() => {
    if (isOpen && user) onClose();
  }, [isOpen, user, onClose]);

  const [msg, setMsg] = useState('');
  useEffect(() => {
    if (isOpen) setMsg('');
  }, [isOpen]);

  // separate loading flags
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmailIn, setLoadingEmailIn] = useState(false);
  const [loadingEmailUp, setLoadingEmailUp] = useState(false);
  const [loadingNickIn, setLoadingNickIn] = useState(false);
  const [loadingNickUp, setLoadingNickUp] = useState(false);

  // which main tab is active? (login | signup)
  const [rootTab, setRootTab] = useState('login');

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

  // -------- forms ----------
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
        // modal will close via useAuth effect
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
    // NOTE: no nickname here (as requested)
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

  // panel styling changes with root tab to make the mode obvious
  const panelBg = rootTab === 'login' ? 'gray.50' : 'pink.50';
  const panelBorder = rootTab === 'login' ? 'gray.300' : 'pink.200';
  const rootPalette = rootTab === 'login' ? 'gray' : 'pink';

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">Account</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          {/* --- MAIN TABS (Log in / Sign up) --- */}
          <Tabs.Root
            value={rootTab}
            onValueChange={({ value }) => setRootTab(value)}
            variant="outline"
            colorPalette={rootPalette}
            fitted
          >
            <Tabs.List mb="4">
              <Tabs.Trigger value="login">Log in</Tabs.Trigger>
              <Tabs.Trigger value="signup">Sign up</Tabs.Trigger>
              <Tabs.Indicator />
            </Tabs.List>

            {/* ------- LOGIN ------- */}
            <Tabs.Content value="login">
              <Box bg={panelBg} borderWidth="1px" borderColor={panelBorder} rounded="lg" p="5">
                <VStack align="stretch" spacing={4}>
                  <Button onClick={google} isLoading={loadingGoogle} variant="outline">
                    Continue with Google
                  </Button>

                  <HStack align="center"><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                  {/* inner tabs */}
                  <Tabs.Root defaultValue="email" variant="outline" colorPalette="gray">
                    <Tabs.List mb="4">
                      <Tabs.Trigger value="email">Email</Tabs.Trigger>
                      <Tabs.Trigger value="nickname">Nickname</Tabs.Trigger>
                      <Tabs.Indicator />
                    </Tabs.List>
                    <Tabs.Content value="email"><EmailSignIn /></Tabs.Content>
                    <Tabs.Content value="nickname"><NicknameSignIn /></Tabs.Content>
                  </Tabs.Root>
                </VStack>
              </Box>
            </Tabs.Content>

            {/* ------- SIGN UP ------- */}
            <Tabs.Content value="signup">
              <Box bg={panelBg} borderWidth="1px" borderColor={panelBorder} rounded="lg" p="5">
                <VStack align="stretch" spacing={4}>
                  <Button onClick={google} isLoading={loadingGoogle} variant="outline">
                    Continue with Google
                  </Button>

                  <HStack align="center"><Divider /><Text opacity={0.7}>or</Text><Divider /></HStack>

                  {/* inner tabs */}
                  <Tabs.Root defaultValue="email" variant="outline" colorPalette="pink">
                    <Tabs.List mb="4">
                      <Tabs.Trigger value="email">Email</Tabs.Trigger>
                      <Tabs.Trigger value="nickname">Nickname</Tabs.Trigger>
                      <Tabs.Indicator />
                    </Tabs.List>
                    <Tabs.Content value="email"><EmailSignUp /></Tabs.Content>
                    <Tabs.Content value="nickname"><NicknameSignUp /></Tabs.Content>
                  </Tabs.Root>
                </VStack>
              </Box>
            </Tabs.Content>
          </Tabs.Root>

          {msg && (
            <Text mt={3} fontSize="sm" opacity={0.9}>
              {msg}
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
