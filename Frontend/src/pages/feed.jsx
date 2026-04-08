import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, CardContent, CardHeader, Avatar, Grid, 
  Box, Button, IconButton, TextField, Paper, Divider, List, ListItem, ListItemText, Chip 
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../api/axiosInstance';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      const [postRes, userRes] = await Promise.all([
        axiosInstance.get('/posts'),
        axiosInstance.get('/users')
      ]);
      setPosts(postRes.data.data?.posts || []);
      setUsers(userRes.data.data?.users || []);
    } catch (err) {
      console.error("Backend unreachable - check if your server is running!");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- Image Handling ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- CRUD: Create Post ---
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const { data } = await axiosInstance.post('/posts', formData);
      setPosts([data.data.post, ...posts]); // Add new post to top
      setContent(''); setImage(null); setPreview(null);
    } catch (err) {
      alert("Post failed: " + err.response?.data?.message);
    }
  };

  // --- CRUD: Delete Post ---
  const handleDeletePost = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        
        {/* LEFT COLUMN: Post Creation & Feed */}
        <Grid item xs={12} md={8}>
          
          {/* 1. TEXTAREA & IMAGE UPLOAD SECTION */}
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Create Post</Typography>
            <form onSubmit={handlePostSubmit}>
              <TextField
                fullWidth multiline rows={3}
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <label htmlFor="upload-photo">
                  <input accept="image/*" id="upload-photo" type="file" style={{ display: 'none' }} onChange={handleImageChange} />
                  <Button variant="outlined" component="span" startIcon={<PhotoCamera />}>Photo</Button>
                </label>
                <Button variant="contained" type="submit" disabled={!content && !image}>Post</Button>
              </Box>
              {preview && <Box sx={{ mt: 2 }}><img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }} /></Box>}
            </form>
          </Paper>

          {/* 2. THE POSTS LIST */}
          {posts.map((post) => (
            <Card key={post._id} sx={{ mb: 3, borderRadius: 2 }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{post.author?.username?.[0] || 'U'}</Avatar>}
                title={post.author?.username || 'User'}
                subheader={new Date(post.createdAt).toLocaleDateString()}
                action={<IconButton color="error" onClick={() => handleDeletePost(post._id)}><DeleteIcon /></IconButton>}
              />
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>{post.content}</Typography>
                {post.imageUrl && <img src={post.imageUrl} alt="Post content" style={{ width: '100%', borderRadius: '8px' }} />}
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* RIGHT COLUMN: USER MANAGEMENT */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Manage Users</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {users.map((user) => (
                <ListItem key={user._id} secondaryAction={
                  <IconButton color="error" edge="end" size="small"><DeleteIcon /></IconButton>
                }>
                  <ListItemText primary={user.username} secondary={user.role} />
                  {user.role === 'admin' && <Chip label="Admin" size="small" color="primary" sx={{ ml: 1 }} />}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default Feed;