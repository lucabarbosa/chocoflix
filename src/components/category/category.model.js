import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Category = mongoose.models.Category || mongoose.model('Category', schema);

export default Category;
