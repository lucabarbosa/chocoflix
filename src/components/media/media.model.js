import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['movie', 'serie'],
    default: 'movie'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  poster: [
    {
      type: String
    }
  ],
  languages: [
    {
      type: String
    }
  ],
  subtitles: [
    {
      type: String
    }
  ],
  specs: {}
});

const Media = mongoose.models.Media || mongoose.model('Media', schema);

export default Media;
