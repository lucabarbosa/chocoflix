import { Schema } from 'mongoose';

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
    new Schema({
      filePath: {
        type: String,
        required: true
      },
      language: {
        type: String,
        required: true
      }
    })
  ]
});

export default Media;
