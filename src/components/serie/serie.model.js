import mongoose, { Schema } from 'mongoose';
import Media from '../media/media.model';

const Season = new Schema({
  episodes: [Media]
});

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
  seasons: [Season]
});

const Serie = mongoose.models.Serie || mongoose.model('Serie', schema, 'media');

export default Serie;
