import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Avatar,
  Typography,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { api, updateUserData, currentUser, setCurrentUser } = useAuth();
  const [profile, setProfile] = useState({
    display_name: '',
    avatar_url: '',
    user_code: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch profile data when component mounts or currentUser changes
  useEffect(() => {
    fetchProfile();
  }, [currentUser]); // Add currentUser as dependency

  const fetchProfile = async () => {
    // 🔥 فحص إذا كان api متاح
    if (!api) {
      setNotification({
        type: 'info',
        message: 'Profile loading temporarily unavailable. Please try again later.',
      });
      
      // 🔥 استخدام بيانات currentUser كـ fallback
      if (currentUser) {
        console.log('🔄 Using currentUser data as fallback:', currentUser);
        setProfile({
          display_name: currentUser.display_name || currentUser.username || '',
          avatar_url: currentUser.avatar_url || '',
          user_code: currentUser.user_code || '',
        });
      }
      
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/api/auth/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // 🔥 استخدام بيانات currentUser كـ fallback
      if (currentUser) {
        console.log('🔄 Using currentUser data as fallback:', currentUser);
        setProfile({
          display_name: currentUser.display_name || currentUser.username || '',
          avatar_url: currentUser.avatar_url || '',
          user_code: currentUser.user_code || '',
        });
      }
      
      setNotification({
        type: 'error',
        message: 'Failed to load profile. Using cached data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!api) {
      setNotification({
        type: 'error',
        message: 'Profile update temporarily unavailable. Please try again later.',
      });
      return;
    }

    try {
      await api.post('/api/auth/profile', {
        display_name: profile.display_name,
      });

      // Update context after successful save
      if (updateUserData) {
        await updateUserData();
      }

      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 🔥 فحص إذا كان api متاح
    if (!api) {
      setNotification({
        type: 'error',
        message: 'Avatar upload temporarily unavailable. Please try again later.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/api/auth/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatarUrl = response.data.avatar_url;
      console.log('✅ New avatar URL:', newAvatarUrl);

      // 🔥 تحديث الـ state المحلي
      setProfile(prev => ({ ...prev, avatar_url: newAvatarUrl }));

      // 🔥 تحديث currentUser مباشرة في AuthContext
      if (setCurrentUser && currentUser) {
        const updatedUser = {
          ...currentUser,
          avatar_url: newAvatarUrl
        };
        setCurrentUser(updatedUser);
        
        // 🔥 حفظ في localStorage أيضاً
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        console.log('✅ Updated currentUser with new avatar:', updatedUser);
      }

      // 🔥 تحديث البيانات من API أيضاً (اختياري)
      if (updateUserData) {
        setTimeout(() => updateUserData(), 500); // تأخير قصير للتأكد من التحديث
      }

      setNotification({
        type: 'success',
        message: 'Avatar updated successfully!',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setNotification({
        type: 'error',
        message: 'Failed to upload avatar. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.user_code);
    setNotification({
      type: 'success',
      message: 'Code copied to clipboard!',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
        {/* Avatar Section */}
        <Box position="relative">
          <Avatar
            src={profile.avatar_url || '/assets/images/default-avatar.png'}
            alt={profile.display_name || 'User'}
            sx={{ width: 120, height: 120 }}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            onChange={handleFileSelect}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : <EditIcon />}
            </IconButton>
          </label>
        </Box>

        {/* User Code Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(255, 181, 232, 0.1)',
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Your Code: {profile.user_code}
          </Typography>
          <Tooltip title="Copy Code">
            <IconButton size="small" onClick={handleCopyCode}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Display Name Section */}
        {isEditing ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Display Name"
              value={profile.display_name || ''}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, display_name: e.target.value }))
              }
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">{profile.display_name || 'Add a display name'}</Typography>
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Notification */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.type}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UserProfile; 