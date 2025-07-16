"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Paper, Stack } from '@mui/material';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur login');
      setStep('2fa');
      setMessage('Code envoyé par email.');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur 2FA');
      document.cookie = `jwt=${data.access_token}; path=/; max-age=3600; SameSite=Strict`;
      setMessage('Connexion réussie !');
      setTimeout(() => router.push('/users'), 500);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, maxWidth: 380 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" fontWeight={600} textAlign="center">Connexion</Typography>
          {step === 'login' && (
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
                <TextField label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
                <Button type="submit" variant="contained" color="primary" fullWidth>Se connecter</Button>
              </Stack>
            </form>
          )}
          {step === '2fa' && (
            <form onSubmit={handle2FA} style={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField label="Code 2FA" value={code} onChange={e => setCode(e.target.value)} required fullWidth />
                <Button type="submit" variant="contained" color="primary" fullWidth>Valider</Button>
              </Stack>
            </form>
          )}
          {message && <Typography color="error" textAlign="center">{message}</Typography>}
          {step === 'login' && (
            <Typography variant="body2" textAlign="center" mt={2}>
              Pas de compte ? <Link href="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Inscrivez-vous</Link>
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
} 