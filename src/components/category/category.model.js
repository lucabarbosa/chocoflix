import mongoose from 'mongoose';
mongoose.Promise = Promise;
const schema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Category = mongoose.model('Category', schema);

export default Category;
