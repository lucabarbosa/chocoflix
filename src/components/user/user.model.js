import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  preferedLanguage: { type: String, enum: ['pt', 'en'], default: 'pt' },
  useSubtitle: { type: Boolean, required: false, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
  // breakpoints: {},
  // playlist: {},
  // ratings: {},
  // watched: {}
});

const User = mongoose.models.User || mongoose.model('User', schema);

export default User;
