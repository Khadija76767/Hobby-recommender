import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../../contexts/AuthContext';

const pagesAr = [
  { name: 'الرئيسية', path: '/' },
  { name: 'ركن الهوايات', path: '/dashboard', auth: true },
  { name: 'يوميات الذات', path: '/reflection', auth: true },
];

const settingsAr = [
  { name: 'الملف الشخصي', path: '/profile', icon: <AccountCircleIcon /> },
  { name: 'الإعدادات', path: '/settings', icon: <SettingsIcon /> },
  { name: 'تسجيل الخروج', icon: <LogoutIcon /> },
];

const NavbarAr = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleCloseUserMenu();
  };

  const handleMenuClick = (setting) => {
    if (setting.name === 'تسجيل الخروج') {
      handleLogout();
    } else if (setting.path) {
      navigate(setting.path);
    }
    handleCloseUserMenu();
  };

  const switchToEnglish = () => {
    localStorage.setItem('app_language', 'en');
    window.location.reload();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(135deg, #FFB5E8 0%, #B5DEFF 100%)',
        color: '#4A4A4A',
        direction: 'rtl'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Patrick Hand',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            سليست
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="فتح القائمة"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pagesAr.map((page) => (
                (!page.auth || currentUser) && (
                  <MenuItem 
                    key={page.name} 
                    onClick={handleCloseNavMenu}
                    component={RouterLink}
                    to={page.path}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                )
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Patrick Hand',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            سليست
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pagesAr.map((page) => (
              (!page.auth || currentUser) && (
                <Button
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: theme.palette.primary.main,
                    display: 'block',
                    fontFamily: 'Patrick Hand',
                    '&:hover': {
                      bgcolor: 'rgba(255, 181, 232, 0.1)',
                    },
                  }}
                >
                  {page.name}
                </Button>
              )
            ))}
          </Box>

          {/* Language Toggle */}
          <Box sx={{ ml: 2 }}>
            <Tooltip title="التبديل للإنجليزية">
              <Button
                variant="outlined"
                onClick={switchToEnglish}
                startIcon={<LanguageIcon />}
                sx={{ 
                  fontWeight: 'bold',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                English
              </Button>
            </Tooltip>
          </Box>

          {/* User menu */}
          {currentUser ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="فتح الإعدادات">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUser.display_name || currentUser.full_name || 'المستخدم'}
                    src={currentUser.avatar_url || '/assets/images/default-avatar.png'}
                    sx={{ bgcolor: theme.palette.primary.main }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settingsAr.map((setting) => (
                  <MenuItem key={setting.name} onClick={() => handleMenuClick(setting)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {setting.icon}
                      <Typography textAlign="center">{setting.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ fontFamily: 'Patrick Hand' }}
              >
                تسجيل الدخول
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                sx={{ fontFamily: 'Patrick Hand' }}
              >
                التسجيل
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavbarAr; 