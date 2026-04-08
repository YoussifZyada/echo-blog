import mongoose from 'mongoose';
import 'dotenv';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']); 
import app from './app.js';

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });