import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' hides password from API results
  role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' }
}, { timestamps: true });

// Hash password before saving
//next is not a function
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();

});

export default mongoose.model('User', userSchema);