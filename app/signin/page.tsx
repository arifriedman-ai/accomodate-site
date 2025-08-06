'use client';

// 🌐 Client-side rendering directive for Next.js
// Required for Supabase OAuth (runs in the browser)

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box, Grid, Paper } from '@mui/material';
import { supabase } from '@/lib/supabaseClient';

export default function SignIn() {
  const router = useRouter(); // 📍 Used to redirect after sign-in or to sign-up

  // 🔐 Handles Google OAuth login
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`, // ✅ Go to /profile after login
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error.message);
    }
  };

  // ➕ Navigate to sign-up page (placeholder for separate flow)
  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #DFF1FF, #E6EEFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 1000,
          width: '100%',
          borderRadius: 4,
          padding: 4,
          backgroundColor: '#ffffffcc',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* LEFT – Logo, Tagline, Buttons */}
          <Grid item xs={12} md={6}>
            <Box textAlign="center">
              <Image
                src="/logot.png"
                alt="AccomoDATE logo"
                width={180}
                height={180}
              />

              <Typography variant="h4" sx={{ mt: 3, fontWeight: 700 }}>
                Empowering Inclusive Hiring
              </Typography>

              <Typography sx={{ mt: 2, fontSize: '1rem', color: 'text.secondary' }}>
                Connecting individuals with disabilities to jobs that fit their strengths and needs.
              </Typography>

              {/* 🚀 Sign In with Google */}
              <Button
                variant="contained"
                size="large"
                onClick={handleSignIn}
                sx={{ mt: 4, backgroundColor: '#308CFF', textTransform: 'none' }}
              >
                Sign In with Google
              </Button>

              {/* 📝 Sign Up */}
              <Button
                variant="outlined"
                size="large"
                onClick={handleSignUp}
                sx={{ mt: 2, borderColor: '#308CFF', color: '#308CFF', textTransform: 'none' }}
              >
                Sign Up
              </Button>
            </Box>
          </Grid>

          {/* RIGHT – Illustration */}
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center">
              <Image
                src="/disabled_photo.png"
                alt="Inclusive illustration"
                width={320}
                height={240}
                style={{ borderRadius: '16px' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
