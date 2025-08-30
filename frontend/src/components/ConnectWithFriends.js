import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../contexts/AuthContext';

const ConnectWithFriends = ({ currentHobby }) => {
  const { api, currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const [friendCode, setFriendCode] = useState('');
  const [notification, setNotification] = useState(null);
  const [friendToDelete, setFriendToDelete] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [dailyHobbies, setDailyHobbies] = useState([]); // 🔥 هوايات اليوم
  const [sharedHobbies, setSharedHobbies] = useState([]);

  // 🔥 جلب هوايات اليوم عند تحميل المكون
  useEffect(() => {
    fetchDailyHobbies();
  }, []);

  const fetchDailyHobbies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hobbies/daily`);
      const data = await response.json();
      setDailyHobbies(data.hobbies || []);
      console.log('✅ Daily hobbies loaded:', data.hobbies);
    } catch (error) {
      console.error('❌ Error fetching daily hobbies:', error);
    }
  };

  // Load friends from API
  useEffect(() => {
    const fetchFriends = async () => {
      // فحص إذا كان api متاح
      if (!api) {
        console.log('API not available, skipping friends fetch');
        return;
      }

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
        // استخدام بيانات افتراضية بدلاً من إظهار خطأ
        setFriends([]);
        setNotification({
          type: 'info',
          message: 'Friends feature temporarily unavailable. Please try again later.',
        });
      }
    };

    if (currentUser) {
    fetchFriends();
    }
  }, [api, currentUser]);

  const handleAddFriend = async () => {
    // فحص إذا كان api متاح
    if (!api) {
      setNotification({
        type: 'error',
        message: 'Friends feature temporarily unavailable. Please try again later.',
      });
      return;
    }

    if (!friendCode.trim()) {
      setNotification({
        type: 'error',
        message: 'Please enter a friend code.',
      });
      return;
    }

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

  const handleShare = (friend) => {
    setSelectedFriend(friend);
    setShareDialogOpen(true);
  };

  const shareHobbyWithFriend = async (hobby) => {
    try {
      // 🔥 إرسال الهواية للصديق عبر API
      const shareData = {
        hobby_name: hobby.name,
        hobby_id: hobby.id,
        message: `${currentUser?.display_name || currentUser?.username} يدعوك لتجربة "${hobby.name}" معاً! 🎯✨`
      };

      const response = await api.post(`/api/auth/friends/${selectedFriend.id}/share`, shareData);
      console.log('📤 Share API response:', response.data);

      // إضافة للهوايات المشاركة محلياً
      const newSharedHobby = {
        hobby: hobby.name,
        hobbyId: hobby.id,
        friend: selectedFriend.name,
        friendId: selectedFriend.id,
        date: new Date(),
        sharedBy: currentUser?.display_name || currentUser?.username || 'You',
        shareId: response.data.share_id
      };
      
      setSharedHobbies(prev => [...prev, newSharedHobby]);

      setNotification({
        type: 'success',
        message: `✨ تم إرسال "${hobby.name}" لـ ${selectedFriend.name}! 🎉`,
      });

    } catch (error) {
      console.error('❌ Error sharing hobby:', error);
      setNotification({
        type: 'error',
        message: 'فشل في إرسال الهواية. يرجى المحاولة مرة أخرى.',
      });
    }

    setShareDialogOpen(false);
    setSelectedFriend(null);
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

        {/* Shared Hobbies Section */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #E8F5FF 0%, #F0E8FF 100%)',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: 'Patrick Hand',
                color: '#4A4A4A',
                textAlign: 'center',
                mb: 3,
              }}
            >
              💫 اللحظات المشاركة
            </Typography>

            {sharedHobbies.length > 0 ? (
              <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                {sharedHobbies.map((shared, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 2,
                      mb: 2,
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderLeft: '4px solid #FFB5E8',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ fontWeight: 'bold', color: '#4A4A4A' }}
                      >
                        {shared.hobby}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ color: '#666', mb: 1 }}
                    >
                      مشاركة مع {shared.friend}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ color: '#999' }}
                    >
                      {new Date(shared.date).toLocaleDateString('ar-SA')}
                    </Typography>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontFamily: 'Patrick Hand' }}
                >
                  لم تشارك أي هوايات بعد ✨
                  <br />
                  ابدأ بمشاركة هواية مع أصدقائك! 🎯
                </Typography>
              </Box>
            )}
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

      {/* Share Hobby Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          bgcolor: 'linear-gradient(135deg, #FFB5E8 0%, #FF8CC8 100%)',
          color: 'white',
          fontFamily: 'Patrick Hand'
        }}>
          ✨ مشاركة هواية مع {selectedFriend?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ mb: 3, color: '#666', fontFamily: 'Patrick Hand' }}
          >
            اختر هواية من هوايات اليوم لتشاركها 🎯
          </Typography>
          
          <Grid container spacing={2}>
            {dailyHobbies.map((hobby, index) => (
              <Grid item xs={12} key={hobby.id}>
                <Card
                  onClick={() => shareHobbyWithFriend(hobby)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${
                      index % 2 === 0 ? '#FFE8F5, #FFF4E8' : '#E8F5FF, #F0E8FF'
                    })`,
                    border: '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '2px solid #FFB5E8',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(255, 181, 232, 0.3)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {index % 2 === 0 ? (
                      <FavoriteIcon sx={{ color: '#FF69B4', fontSize: 24 }} />
                    ) : (
                      <StarIcon sx={{ color: '#FFD700', fontSize: 24 }} />
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ fontFamily: 'Patrick Hand', color: '#4A4A4A' }}
                      >
                        {hobby.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: '#666', fontSize: '0.9rem' }}
                      >
                        {hobby.description.substring(0, 60)}...
                      </Typography>
                    </Box>
                    <ShareIcon sx={{ color: '#4A4A4A', opacity: 0.7 }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {dailyHobbies.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                لا توجد هوايات متاحة اليوم 🤔
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={() => setShareDialogOpen(false)}
            sx={{ 
              color: '#666',
              fontFamily: 'Patrick Hand',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' }
            }}
          >
            إلغاء
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