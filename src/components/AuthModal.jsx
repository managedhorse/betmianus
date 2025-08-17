// src/components/AuthModal.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Button, Input, VStack, Text, Checkbox, HStack, Divider, Link, Box, Icon
} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import GoogleSignInButton from './GoogleSignInButton';

const binderTab = {
  px: 4,
  py: 2,
  fontWeight: 'semibold',
  color: 'gray.600',
  bg: 'transparent',
  border: '1px solid',
  borderColor: 'transparent',
  borderBottom: 'none',
  borderTopRadius: 'md',
  _hover: { bg: 'gray.50', color: 'gray.800' },
  _focus: { boxShadow: 'none' },
  _selected: {
    color: 'gray.900',
    bg: 'white',
    borderColor: 'gray.300',
    borderBottomColor: 'white',
    mb: '-1px',
  },
};

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

  // -------- View state: "auth" (tabs) or "reset" (set new password) --------
  const [view, setView] = useState('auth'); // 'auth' | 'reset'
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  // Messaging
  const [msg, setMsg] = useState('');
  const [pendingEmail, setPendingEmail] = useState(''); // for "resend confirmation"
  const [existingEmail, setExistingEmail] = useState(''); // for "email already registered"
  useEffect(() => {
    if (isOpen) {
      setMsg('');
      setPendingEmail('');
      setExistingEmail('');
    }
  }, [isOpen]);

  // Loaders
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmailIn, setLoadingEmailIn] = useState(false);
  const [loadingNickIn, setLoadingNickIn] = useState(false);
  const [loadingEmailUp, setLoadingEmailUp] = useState(false);
  const [loadingNickUp, setLoadingNickUp] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingSetPwLink, setLoadingSetPwLink] = useState(false);

  // Detect Supabase recovery flow (email link lands with #type=recovery)
  useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1));
    if (fromHash.get('type') === 'recovery') {
      setView('reset');
      setIsRecoverySession(true);
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView('reset');
        setIsRecoverySession(true);
      }
    });
    return () => sub.subscription?.unsubscribe();
  }, []);

  // Auto-close when signed in — but not while on the reset screen.
  useEffect(() => {
    if (isOpen && user && view !== 'reset') onClose();
  }, [isOpen, user, view, onClose]);

  // ---------- actions ----------
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

  const resendConfirmation = async () => {
    if (!pendingEmail) return;
    const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail });
    setMsg(error ? error.message : `Confirmation email re-sent to ${pendingEmail}.`);
  };

  const sendPasswordSetupLink = async (email) => {
    if (!email) return;
    setMsg('');
    setLoadingSetPwLink(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}`,
    });
    setMsg(error ? error.message : `We sent a password set link to ${email}.`);
    setLoadingSetPwLink(false);
  };

  // ---------- forms ----------
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

    const forgot = async () => {
      setMsg('');
      if (!email) return setMsg('Enter your email above first.');
      setLoadingReset(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });
      if (error) setMsg(error.message);
      else setMsg('Password reset email sent. Check your inbox.');
      setLoadingReset(false);
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
          <HStack justify="space-between">
            <span />
            <Link onClick={forgot} fontSize="sm" color="gray.700" _hover={{ color: 'gray.900' }}>
              {loadingReset ? 'Sending…' : 'Forgot password?'}
            </Link>
          </HStack>
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
          <Button type="submit" isLoading={loadingNickIn}>Log in with nickname</Button>
        </VStack>
      </form>
    );
  };

  const EmailSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [existingProviders, setExistingProviders] = useState([]); // <— add

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setExistingEmail('');
    setPendingEmail('');
    setExistingProviders([]);
    if (!agree) return setMsg('Please confirm you are 18+ and accept the Terms.');

    // 1) PRE-CHECK on the server — block if email already exists for any provider
    try {
  const check = await postJSON('/api/check-email', { email });
  if (check.exists) {
    setExistingEmail(email);
    const prov = check.providers || [];
    setExistingProviders(prov);

    // Your rule: block and show a single message
    setMsg('That email is already in use.');

    // Do NOT proceed to signUp()
    return;
  }
} catch (err) {
  setMsg('Could not verify email. Please try again.');
  return;
}

    // 2) Safe to create the email/password account
    setLoadingEmailUp(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoadingEmailUp(false);

    if (error) return setMsg(error.message);

    // If there's a session, confirmation is OFF → signed in immediately
    if (data?.session) {
      setMsg('Account created. You’re signed in!');
      return;
    }

    // Confirmation required
    setPendingEmail(email);
    setMsg(`We sent a confirmation link to ${email}.`);
  };

  // UI (unchanged, but shows different actions when we blocked for existing email)
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

        {/* Only shown when we actually did signUp and Supabase will send an email */}
        {pendingEmail && (
          <Text fontSize="sm" color="gray.700">
            Didn’t get it?{' '}
            <Link onClick={resendConfirmation} textDecoration="underline">
              Resend confirmation email
            </Link>
          </Text>
        )}

        {/* Shown when we blocked because the email already exists */}
        {existingEmail && !pendingEmail && (
  <Box fontSize="sm" color="gray.700">
    <VStack align="start" spacing={2} mt={2}>
      {/* If the account already has email/password, give them reset */}
      {existingProviders.includes('email') && (
        <Button
          size="sm"
          variant="link"
          onClick={() =>
            supabase.auth.resetPasswordForEmail(existingEmail, {
              redirectTo: window.location.origin,
            })
          }
          isLoading={loadingSetPwLink}
        >
          Reset password for {existingEmail}
        </Button>
      )}

      {/* If the account is Google, only offer Google sign-in */}
      {existingProviders.includes('google') && (
        <GoogleSignInButton
  onError={(m) => setMsg(m)}
  width="100%"
/>
      )}
    </VStack>
  </Box>
)}
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
      if (!agree) return setMsg('Please confirm you are 18+ and accept the Terms.');
      if (!/^[A-Za-z0-9_]{3,20}$/.test(username))
        return setMsg('Nickname must be 3–20 characters: letters, numbers, underscore.');
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

  // -------- Reset Password panel (inside modal) --------
  const ResetPanel = () => {
    const [pw1, setPw1] = useState('');
    const [pw2, setPw2] = useState('');
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
      e.preventDefault();
      setMsg('');
      if (pw1.length < 6) return setMsg('Password must be at least 6 characters.');
      if (pw1 !== pw2) return setMsg('Passwords do not match.');
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: pw1 });
      if (error) setMsg(error.message);
      else {
        setMsg('Password updated. You can now sign in.');
        setTimeout(() => setView('auth'), 1200);
      }
      setSaving(false);
    };

    const goBack = async () => {
      setMsg('');
      if (isRecoverySession) {
        try { await supabase.auth.signOut(); } catch {}
        setIsRecoverySession(false);
      }
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      setView('auth');
    };

    return (
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Button onClick={goBack} size="sm" variant="ghost" leftIcon={<Icon as={FiArrowLeft} />}>
            Back to log in
          </Button>
        </HStack>

        <Text fontWeight="semibold">Set a new password</Text>
        <form onSubmit={submit}>
          <VStack align="stretch" spacing={3}>
            <Input
              type="password"
              placeholder="New password"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              required
              bg="white"
              borderColor="gray.400"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
              bg="white"
              borderColor="gray.400"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ borderColor: 'gray.700', boxShadow: 'none' }}
            />
            <Button type="submit" isLoading={saving}>Update password</Button>
          </VStack>
        </form>
      </VStack>
    );
  };

  // -------- Render --------
  const AuthTabs = useMemo(
    () => (
      <Tabs isFitted variant="unstyled">
        <TabList gap={2} mb="-1px">
          <Tab sx={binderTab}>Log in</Tab>
          <Tab sx={binderTab}>Sign up</Tab>
        </TabList>

        <TabPanels borderWidth="1px" borderColor="gray.300" rounded="md" bg="white" p={5}>
          {/* LOG IN */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <GoogleSignInButton
  onError={(m) => setMsg(m)}
  width="100%"
/>

              <HStack align="center"><Divider /><Text color="gray.600">or</Text><Divider /></HStack>

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

          {/* SIGN UP */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <GoogleSignInButton
  onError={(m) => setMsg(m)}
  width="100%"
/>

              <HStack align="center"><Divider /><Text color="gray.600">or</Text><Divider /></HStack>

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
    ),
    [loadingGoogle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent id="auth-modal" bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">
          Account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box>
            {view === 'auth' ? (
              AuthTabs
            ) : (
              // "Reset" header styled like a binder tab, without Tabs context
              <Box>
                <Box display="flex" gap={2} mb="-1px">
                  <Box
                    px={4}
                    py={2}
                    fontWeight="semibold"
                    color="gray.900"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderBottom="none"
                    borderTopRadius="md"
                  >
                    Reset
                  </Box>
                </Box>
                <Box borderWidth="1px" borderColor="gray.300" rounded="md" bg="white" p={5}>
                  <ResetPanel />
                </Box>
              </Box>
            )}
          </Box>

          {msg && (
            <Text mt={3} fontSize="sm" color="gray.800">
              {msg}
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
