import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  redirectUrl: {
    type: String,
    required: true,
  },
  clickHistory: [
    {
      timeStamp: {
        type: Number,
      },
    },
  ],
});

export const Url = mongoose.model('url', urlSchema);
