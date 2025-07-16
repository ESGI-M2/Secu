"use client";
import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1];
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getCookie('jwt');
    if (!token) {
      setError('Non authentifié (pas de JWT trouvé)');
      return;
    }
    fetch('/users', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          setError(`Erreur ${res.status}: ${text}`);
          return;
        }
        setUsers(await res.json());
      })
      .catch(e => setError('Erreur JS: ' + e.message));
  }, []);

  if (error) return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, maxWidth: 500 }}>
        <Typography color="error" textAlign="center">{error}</Typography>
      </Paper>
    </Box>
  );

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f6fa">
      <Paper elevation={3} sx={{ p: 4, minWidth: 340, maxWidth: 700 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" fontWeight={600} textAlign="center">Administration des utilisateurs</Typography>
          <Typography variant="body1" textAlign="center" mb={2}>
            Bienvenue sur la page d'administration. Ici, vous pouvez gérer les utilisateurs de l'application.
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u, i) => (
                  <TableRow key={i}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Paper>
    </Box>
  );
} 