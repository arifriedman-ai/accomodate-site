'use client';

// 🎨 UI Components from Material UI
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Container,
  Button,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// 🧭 Navigation tools from Next.js
import { useRouter, usePathname } from 'next/navigation';

// 🧠 State & Effects from React
import { useEffect, useState } from 'react';

// 🔐 Supabase client (handles auth and database)
import { supabase } from '@/lib/supabaseClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // 🎯 Track current user's display name and ID
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  /**
   * 🔄 Fetch the logged-in user's custom username from Supabase.
   * Re-run this every time the route (pathname) changes,
   * so updates from /usersettings show up in the navbar instantly.
   */
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      // 1️⃣ Get the authenticated user from Supabase Auth
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return; // If not signed in or error, exit early

      setUserId(user.id); // Store the UUID for future use

      // 2️⃣ Try to get custom username from 'profiles' table
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      // 3️⃣ Set username: use custom one if available, fallback to email
      if (profileError || !data || !data.username) {
        setUsername(user.email);
      } else {
        setUsername(data.username);
      }
    };

    fetchUserAndProfile(); // Call the async function
  }, [pathname]); // ✅ Runs again when the user returns from settings

  /**
   * 🚪 Logs the user out of Supabase and sends them to the /signin page
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  // 🚫 Don’t show navbar on sign-in page
  const hideNavbar = pathname === '/signin';

  return (
    <html lang="en">
      <body>
        {/* 🧭 Top Navigation Bar (unless on /signin) */}
        {!hideNavbar && (
          <AppBar position="static" sx={{ backgroundColor: '#308CFF' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              {/* 🌐 App Logo / Home Link */}
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, cursor: 'pointer' }}
                onClick={() => router.push('/profile')}
              >
                AccomoDATE
              </Typography>

              {/* 👤 Username, Settings, and Log Out */}
              <Box display="flex" alignItems="center" gap={2}>
                {/* ✅ Show username or graceful fallback while loading */}
                {username ? (
                  <Typography variant="body1">{username}</Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                )}

                {/* ⚙️ Settings Icon */}
                <Tooltip title="Settings">
                  <IconButton
                    onClick={() => router.push('/usersettings')}
                    color="inherit"
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>

                {/* 🚪 Log Out Button */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}
                  onClick={handleLogout}
                >
                  Log Out
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        )}

        {/* 🧱 All page content will render here */}
        <Container sx={{ mt: 4 }}>{children}</Container>
      </body>
    </html>
  );
}
