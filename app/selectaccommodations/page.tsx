'use client';

// 📦 Imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Container,
  Grid,
  Chip,
  Button,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import HearingIcon from '@mui/icons-material/Hearing';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import { supabase } from '@/lib/supabaseClient';

const sections = [
  {
    key: 'physical',
    title: 'Physical Accessibility',
    icon: <AccessibilityIcon />,
    description: 'Accommodations for mobility, strength, and stamina-related needs.',
    options: [
      'Wheelchair access',
      'Accessible restroom',
      'Ergonomic workspace',
      'Elevator access',
      'Adjustable desk height',
    ],
  },
  {
    key: 'sensory',
    title: 'Sensory Environment',
    icon: <HearingIcon />,
    description: 'Considerations for sensory processing and sensitivities.',
    options: [
      'Quiet workspace',
      'Noise-canceling headphones',
      'Natural lighting',
      'Low-stimulation environment',
      'Scent-free policy',
    ],
  },
  {
    key: 'mental',
    title: 'Mental Health & Neurodivergence',
    icon: <PsychologyIcon />,
    description: 'Supports for focus, anxiety, or cognitive processing.',
    options: [
      'Mental health breaks',
      'Flexible deadlines',
      'Clear written instructions',
      'Minimal supervision',
      'Regular feedback sessions',
    ],
  },
  {
    key: 'communication',
    title: 'Communication Preferences',
    icon: <ChatIcon />,
    description: 'Supports for how you interact and receive information.',
    options: [
      'Written over verbal instructions',
      'Alternative communication tools',
      'Captioning for meetings',
      'Visual aids',
      'Time to process responses',
    ],
  },
  {
    key: 'schedule',
    title: 'Work Schedule',
    icon: <ScheduleIcon />,
    description: 'Timing flexibility and scheduling accommodations.',
    options: [
      'Flexible hours',
      'Reduced hours',
      'Breaks as needed',
      'Start/end time flexibility',
      'Split shifts',
    ],
  },
  {
    key: 'remote',
    title: 'Remote Work',
    icon: <LaptopMacIcon />,
    description: 'Remote or hybrid work options.',
    options: [
      'Remote work full-time',
      'Hybrid work options',
      'Virtual meetings only',
      'Work-from-home tech support',
      'Asynchronous communication',
    ],
  },
];

interface Selection {
  label: string;
  priority: 'must' | 'nice';
  private: boolean;
}

export default function SelectAccommodationsPage() {
  const [selections, setSelections] = useState<{ [section: string]: Selection[] }>({});
  const [userId, setUserId] = useState<string>('');

  // 🔁 Load saved accommodations on mount
  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
  
      console.log('User:', user);
      if (error || !user) {
        console.log('No user found or auth error', error);
        return;
      }
  
      setUserId(user.id);
  
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('accommodations')
        .eq('id', user.id)
        .single();
  
      console.log('Profile loaded:', profile);
  
      if (profile?.accommodations) {
        setSelections(profile.accommodations);
      }
    };
  
    loadProfile();
  }, []);
  

  // 🔁 Toggle bubble: off → nice → must → off
  const handleToggle = (sectionKey: string, label: string) => {
    setSelections((prev) => {
      const section = prev[sectionKey] || [];
      const index = section.findIndex((item) => item.label === label);

      // 🔁 Cycle states
      if (index >= 0) {
        const current = section[index];
        if (current.priority === 'nice') {
          section[index] = { ...current, priority: 'must' };
        } else {
          section.splice(index, 1); // remove from list
        }
      } else {
        section.push({ label, priority: 'nice', private: false });
      }

      return { ...prev, [sectionKey]: [...section] };
    });
  };

  // 🔒 Toggle privacy on lock icon click
  const handleTogglePrivacy = (sectionKey: string, label: string) => {
    setSelections((prev) => {
      const updated = (prev[sectionKey] || []).map((item) =>
        item.label === label ? { ...item, private: !item.private } : item
      );
      return { ...prev, [sectionKey]: updated };
    });
  };

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ accommodations: selections })
      .eq('id', userId);

    if (error) {
      console.error('Error saving accommodations:', error);
    } else {
      alert('Accommodations saved successfully!');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select Your Accommodations
      </Typography>

      {sections.map((section) => (
        <Box key={section.key} sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            {section.icon} <Box ml={1}>{section.title}</Box>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {section.description}
          </Typography>

          <Grid container spacing={1}>
            {section.options.map((label) => {
              const selected = selections[section.key]?.find((s) => s.label === label);
              const isNice = selected?.priority === 'nice';
              const isMust = selected?.priority === 'must';
              const isPrivate = selected?.private;

              return (
                <Grid item key={label}> 
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={label}
                      clickable
                      onClick={() => handleToggle(section.key, label)}
                      sx={{
                        bgcolor: isMust ? '#ff6961' : isNice ? '#77dd77' : 'default',
                        color: isMust || isNice ? '#fff' : 'default',
                        fontWeight: isMust ? 600 : 400,
                      }}
                    />
                    {selected && (
                      <Tooltip title={isPrivate ? 'Private' : 'Public'}>
                        <IconButton
                          size="small"
                          onClick={() => handleTogglePrivacy(section.key, label)}
                        >
                          {isPrivate ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      <Box textAlign="center" mt={6}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Accommodations
        </Button>
      </Box>
    </Container>
  );
}
