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
  saga: [Media]
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', schema, 'media');

export default Movie;
