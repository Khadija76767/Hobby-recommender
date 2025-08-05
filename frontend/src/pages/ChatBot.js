import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const ChatBot = () => {
  const { hobbyId } = useParams();
  const [hobby, setHobby] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch hobby details on component mount
  useEffect(() => {
    const fetchHobbyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/hobbies/${hobbyId}`);
        setHobby(response.data);
        
        // Add initial welcome message
        setMessages([
          {
            id: 'welcome',
            sender: 'ai',
            content: `Hi there! I'm your AI hobby assistant for ${response.data.name}. How can I help you today? You can ask me about getting started, equipment recommendations, learning resources, or any other questions about ${response.data.name}.`,
            timestamp: new Date()
          }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hobby details:', err);
        setError('Failed to load hobby information. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchHobbyDetails();
  }, [hobbyId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSending(true);
    
    try {
      // Send message to API
      const response = await axios.post(`/api/chat/hobby/${hobbyId}/chat`, {
        content: newMessage
      });
      
      // Add AI response to messages
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: response.data.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setSending(false);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setSending(false);
    }
  };
  
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const handleBack = () => {
    navigate(`/hobby/${hobbyId}`);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <IconButton 
            color="inherit" 
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <SmartToyIcon />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {loading ? 'Loading...' : `Chat about ${hobby?.name}`}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Messages List */}
        <Box
          sx={{
            height: '60vh',
            overflowY: 'auto',
            p: 2,
            bgcolor: 'grey.50',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {messages.map((message) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      mb: 2,
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        sx={{
                          bgcolor: message.sender === 'user' 
                            ? 'secondary.main' 
                            : message.sender === 'ai' 
                              ? 'primary.main' 
                              : 'error.main',
                          width: 32,
                          height: 32,
                        }}
                      >
                        {message.sender === 'user' ? (
                          <PersonIcon fontSize="small" />
                        ) : (
                          <SmartToyIcon fontSize="small" />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          sx={{
                            bgcolor: message.sender === 'user' 
                              ? 'secondary.light' 
                              : message.sender === 'ai' 
                                ? 'primary.light' 
                                : 'error.light',
                            color: message.sender === 'user' 
                              ? 'secondary.contrastText' 
                              : message.sender === 'ai' 
                                ? 'primary.contrastText' 
                                : 'error.contrastText',
                            p: 2,
                            borderRadius: 2,
                            display: 'inline-block',
                            maxWidth: '80%',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {message.content}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            textAlign: message.sender === 'user' ? 'right' : 'left',
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      }
                      sx={{
                        margin: 0,
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>
        
        <Divider />
        
        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading || sending}
            multiline
            maxRows={3}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            type="submit"
            disabled={loading || sending || !newMessage.trim()}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBot; 