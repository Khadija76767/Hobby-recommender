import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';

const ConnectWithFriends = ({ currentHobby }) => {
  const { currentUser, api } = useAuth();
  const [friends, setFriends] = useState([]);
  const [sharedHobbies, setSharedHobbies] = useState([]);
  const [notification, setNotification] = useState(null);
  const [friendCode, setFriendCode] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState(null);

  // Load friends from API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get('/api/auth/friends');
        setFriends(response.data.map(f => ({
          id: f.id,
          name: f.display_name || f.username,
          photoURL: f.avatar_url || '/assets/images/default-avatar.png',
          code: f.user_code,
            hobbies: []
          })));
      } catch (error) {
        console.error('Error fetching friends:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load friends. Please try again.',
        });
      }
    };

    fetchFriends();
  }, [api]);

  const handleAddFriend = async () => {
    try {
      const response = await api.post(`/api/auth/friends/${friendCode}`);
      const friendData = response.data;
      
        const newFriend = {
          id: friendData.id,
        name: friendData.display_name || friendData.username,
          photoURL: friendData.avatar_url || '/assets/images/default-avatar.png',
          code: friendData.user_code,
          hobbies: []
        };

        setFriends(prev => [...prev, newFriend]);
        setFriendCode('');
        setNotification({
          type: 'success',
          message: `Added ${newFriend.name} as a friend! 🎉`,
        });
    } catch (error) {
      console.error('Error adding friend:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to add friend. Please try again.',
      });
    }
  };

  const handleShare = async (friend) => {
    const invitationMessage = `${currentUser.display_name} invites you to try ${currentHobby} together!`;

    const newSharedHobby = {
      hobby: currentHobby,
      friend: friend.name,
      date: new Date(),
    };
    setSharedHobbies([...sharedHobbies, newSharedHobby]);

    setNotification({
      type: 'success',
      message: `Shared ${currentHobby} with ${friend.name}! 💌`,
    });
  };

  const handleRemoveFriend = (friend) => {
    setFriendToDelete(friend);
    setConfirmDeleteOpen(true);
  };

  const confirmRemoveFriend = async () => {
    try {
      await api.delete(`/api/auth/friends/${friendToDelete.id}`);
        const updatedFriends = friends.filter(f => f.id !== friendToDelete.id);
        setFriends(updatedFriends);

        setNotification({
          type: 'success',
          message: `Removed ${friendToDelete.name} from your friends list`,
        });
    } catch (error) {
      console.error('Error removing friend:', error);
      setNotification({
        type: 'error',
        message: error.response?.data?.detail || 'Failed to remove friend. Please try again.',
      });
    }

    setConfirmDeleteOpen(false);
    setFriendToDelete(null);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        fontFamily="Patrick Hand"
        sx={{
          color: '#4A4A4A',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <PersonAddIcon /> Share With Friends
      </Typography>

      {/* Add Friend by Code */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #E8F5FF 0%, #FFF4F9 100%)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Friend's Code"
            value={friendCode}
            onChange={(e) => setFriendCode(e.target.value)}
            placeholder="Enter 6-digit code"
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleAddFriend}
            startIcon={<PersonAddIcon />}
            sx={{
              bgcolor: 'rgba(255, 181, 232, 0.9)',
              color: '#4A4A4A',
              '&:hover': {
                bgcolor: 'rgba(255, 181, 232, 0.7)',
              },
            }}
          >
            Add Friend
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Friends List */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #FFF4E8 0%, #FFE8F5 100%)',
            }}
          >
            <Grid container spacing={2}>
              {friends.map((friend) => (
                <Grid item xs={12} key={friend.id}>
                  <Card
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <Box
                      component="img"
                      src={friend.photoURL}
                      alt={friend.name}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontFamily="Patrick Hand">
                        {friend.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {friend.hobbies.map((hobby) => (
                          <Chip
                            key={hobby}
                            label={hobby}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 181, 232, 0.1)',
                              border: '1px solid rgba(255, 181, 232, 0.3)',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleShare(friend)}
                        sx={{ color: '#4A4A4A' }}
                      >
                        <ShareIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveFriend(friend)}
                        sx={{
                          color: '#ff6b6b',
                          '&:hover': {
                            color: '#ff4444',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
              {friends.length === 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No friends added yet. Add friends using their unique code! ✨
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Shared Hobbies */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #E8F5FF 0%, #FFF4F9 100%)',
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              fontFamily="Patrick Hand"
              sx={{ color: '#4A4A4A', mb: 2 }}
            >
              Shared Moments ✨
            </Typography>
            {sharedHobbies.map((share, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You and {share.friend} both like
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {share.hobby} 🎨
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Remove Friend
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove {friendToDelete?.name} from your friends list?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDeleteOpen(false)}
            sx={{ color: '#4A4A4A' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRemoveFriend}
            variant="contained"
            sx={{
              bgcolor: '#ff6b6b',
              '&:hover': {
                bgcolor: '#ff4444',
              }
            }}
          >
            Remove Friend
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.type}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConnectWithFriends; 