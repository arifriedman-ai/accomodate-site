'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UserSettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('Unable to load user data.');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Unable to fetch profile.');
      } else {
        const currentUsername = profile.username || user.email;
        setUsername(currentUsername);
        setNewUsername(currentUsername);
      }

      setLoading(false);
    };

    fetchUsername();
  }, []);

  const handleUsernameUpdate = async () => {
    setSuccess('');
    setError('');

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError('User authentication failed.');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: newUsername })
      .eq('id', user.id);

    if (updateError) {
      setError('Failed to update username.');
    } else {
      setUsername(newUsername);
      setSuccess('Username updated successfully.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your settings...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Settings
      </Typography>

      <Typography variant="body1">
        Signed in as <strong>{username}</strong>
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Change Username
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleUsernameUpdate}>
            Save
          </Button>
        </Stack>
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Accommodations
        </Typography>
        <Button variant="outlined" onClick={() => router.push('/selectaccommodations')}>
          Edit Accommodations
        </Button>
      </Box>
    </Box>
  );
}
