import mongoose, { Schema } from 'mongoose';
import Media from '../media/media.model';

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  seasons: [[Media]]
});

const Serie = mongoose.models.Serie || mongoose.model('Serie', schema, 'media');

export default Serie;
