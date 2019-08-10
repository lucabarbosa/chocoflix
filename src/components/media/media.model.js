import mongoose, { Schema } from 'mongoose';

const Media = new Schema({
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
  posters: [
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
  ]
});

export default Media;
