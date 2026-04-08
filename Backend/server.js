import mongoose from 'mongoose';
import { config } from '@dotenvx/dotenvx';
config(); // Load encrypted environment variables
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import app from './app.js';
import { seedData } from './seedData.js'; // 1. Import your seed function

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => { // 2. Add 'async' here so we can use 'await'
    console.log('✅ MongoDB Connected');
    
    // 3. Run the seeder before the server starts listening
    await seedData();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });