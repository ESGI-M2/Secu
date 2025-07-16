"use client";
import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Stack } from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstname, lastname, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur register');
      setMessage('Inscription réussie ! Vérifiez vos emails pour confirmer.');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, maxWidth: 380 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" fontWeight={600} textAlign="center">Inscription</Typography>
          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
              <TextField label="Prénom" value={firstname} onChange={e => setFirstname(e.target.value)} required fullWidth />
              <TextField label="Nom" value={lastname} onChange={e => setLastname(e.target.value)} required fullWidth />
              <TextField label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
              <Button type="submit" variant="contained" color="primary" fullWidth>S'inscrire</Button>
            </Stack>
          </form>
          {message && <Typography color="error" textAlign="center">{message}</Typography>}
        </Stack>
      </Paper>
    </Box>
  );
} 