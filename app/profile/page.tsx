'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import HearingIcon from '@mui/icons-material/Hearing';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';

// 🧠 Reuse the same section definitions for consistency
const sections = [
  { key: 'physical', title: 'Physical Accessibility', icon: <AccessibilityIcon /> },
  { key: 'sensory', title: 'Sensory Environment', icon: <HearingIcon /> },
  { key: 'mental', title: 'Mental Health & Neurodivergence', icon: <PsychologyIcon /> },
  { key: 'communication', title: 'Communication Preferences', icon: <ChatIcon /> },
  { key: 'schedule', title: 'Work Schedule', icon: <ScheduleIcon /> },
  { key: 'remote', title: 'Remote Work', icon: <LaptopMacIcon /> },
];

export default function ProfilePage() {
  const [username, setUsername] = useState('');
  const [accommodations, setAccommodations] = useState<{ [section: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
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
        .select('username, accommodations')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        setError('Unable to fetch profile.');
      } else {
        setUsername(profile.username || user.email);
        setAccommodations(profile.accommodations || {});
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Loading your profile...
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
        Your Profile
      </Typography>
      <Typography variant="body1">
        Welcome back, <strong>{username}</strong>!
      </Typography>

      <Typography sx={{ mt: 4 }} variant="h6">
        Your Selected Accommodations
      </Typography>

      {sections.map((section) => {
        const items = accommodations[section.key] || [];
        if (items.length === 0) return null;

        return (
          <Box key={section.key} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
              {section.icon} <Box ml={1}>{section.title}</Box>
            </Typography>
            <Grid container spacing={1} mt={1}>
              {items.map((item) => (
                <Grid item key={item.label}>
                  <Tooltip
                    title={
                      item.private
                        ? `Private — ${item.priority === 'must' ? 'Must-have' : 'Nice-to-have'}`
                        : `${item.priority === 'must' ? 'Must-have' : 'Nice-to-have'}`
                    }
                  >
                    <Chip
                      label={item.label}
                      icon={item.private ? <LockIcon fontSize="small" /> : undefined}
                      sx={{
                        bgcolor: item.priority === 'must' ? '#ff6961' : '#77dd77',
                        color: '#fff',
                        fontWeight: 500,
                      }}
                    />
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}