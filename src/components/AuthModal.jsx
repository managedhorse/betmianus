import { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Tabs, TabList, TabPanels, Tab, TabPanel, Button, Input, VStack, Text, Checkbox
} from '@chakra-ui/react';
import { supabase } from '../lib/supabaseClient';

async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(()=> ({}));
  if (!r.ok) throw new Error(j.error || 'Request failed');
  return j;
}

export default function AuthModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const google = async () => {
    setLoading(true); setMsg('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) setMsg(error.message);
    setLoading(false);
  };

  const EmailSignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submit = async (e) => {
      e.preventDefault(); setLoading(true); setMsg('');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message); else onClose();
      setLoading(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Button type="submit" isLoading={loading}>Sign in</Button>
        </VStack>
      </form>
    );
  };

  const EmailSignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const submit = async (e) => {
      e.preventDefault(); setLoading(true); setMsg('');
      if (!agree) { setMsg('Please confirm you are 18+ and accept the Terms.'); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username }, emailRedirectTo: window.location.origin }
      });
      setMsg(error ? error.message : 'Check your email to confirm your account.');
      setLoading(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input placeholder="Nickname (public)" value={username} onChange={e=>setUsername(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Checkbox isChecked={agree} onChange={e=>setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loading}>Create account</Button>
        </VStack>
      </form>
    );
  };

  const NicknameSignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const submit = async (e) => {
      e.preventDefault(); setLoading(true); setMsg('');
      if (!agree) { setMsg('Please confirm you are 18+ and accept the Terms.'); setLoading(false); return; }
      try {
        await postJSON('/api/signup-nickname', { username, password });
        setMsg('Account created. You can now sign in with your nickname.');
      } catch (err) {
        setMsg(err.message);
      }
      setLoading(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input placeholder="Nickname (3–20 letters/numbers/_)" value={username} onChange={e=>setUsername(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Checkbox isChecked={agree} onChange={e=>setAgree(e.target.checked)}>
            I am 18+ and accept the Terms & Risk Policy
          </Checkbox>
          <Button type="submit" isLoading={loading}>Create nickname account</Button>
        </VStack>
      </form>
    );
  };

  const NicknameSignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const submit = async (e) => {
      e.preventDefault(); setLoading(true); setMsg('');
      try {
        const session = await postJSON('/api/login-username', { username, password });
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });
        onClose();
      } catch (err) {
        setMsg(err.message);
      }
      setLoading(false);
    };
    return (
      <form onSubmit={submit}>
        <VStack align="stretch" spacing={3}>
          <Input placeholder="Nickname" value={username} onChange={e=>setUsername(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <Button type="submit" isLoading={loading}>Sign in with nickname</Button>
        </VStack>
      </form>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="#ffbed9" color="black">
        <ModalHeader fontFamily="Slackey, cursive" textTransform="uppercase">Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={3}>
            <Button onClick={google} isLoading={loading} variant="outline">
              Continue with Google
            </Button>
            <Text textAlign="center" opacity={0.7}>or</Text>

            <Tabs variant="enclosed" isFitted>
              <TabList>
                <Tab>Email sign in</Tab>
                <Tab>Nickname sign in</Tab>
              </TabList>
              <TabPanels>
                <TabPanel><EmailSignIn /></TabPanel>
                <TabPanel><NicknameSignIn /></TabPanel>
              </TabPanels>
            </Tabs>

            <Tabs variant="enclosed" isFitted mt={2}>
              <TabList>
                <Tab>Email sign up</Tab>
                <Tab>Nickname sign up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel><EmailSignUp /></TabPanel>
                <TabPanel><NicknameSignUp /></TabPanel>
              </TabPanels>
            </Tabs>

            {msg && <Text fontSize="sm" opacity={0.9}>{msg}</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}